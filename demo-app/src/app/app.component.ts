import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserDetail } from '../app/classes/user-detail';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {



  private defaultLat: number = -37.81792077237497;
  private defaultLng: number = 144.96906280517578;
  private locationSelected: boolean = false;

  private user: UserDetail;
  private isUserLoggedIn: boolean;
  private userList: Array<UserDetail> = [];
  // public loggedInUser: string;
  private errorMessage: string;
  public showLoginPage: boolean;

  //getting the current date for all dates
  public currentDate = new Date();
  public currentYear = this.currentDate.getFullYear();
  public currentMonth = this.currentDate.getMonth() + 1;
  public currentDay = this.currentDate.getDate();

  myDatePickerOption: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    showInputField: true,
    showClearDateBtn: false,
    inline: false,
    editableDateField: false,
    openSelectorOnInputClick: true,
    disableSince: { year: this.currentYear, month: this.currentMonth, day: this.currentDay + 1 },
    showTodayBtn: false
  };

  public modelDate: any;

  constructor() {

  }

  ngOnInit() {

    this.resetValues();

    if (this.isUserLoggedIn) {
      this.user = this.userList.find(a => a.emailId === this.user.emailId.toLowerCase().trim());
    }
    else {
      this.user = new UserDetail("", "", "", null, this.defaultLat, this.defaultLng);
    }
  }

  public resetValues() {
    this.isUserLoggedIn = false;
    //  this.loggedInUser = "";
    this.userList = [];
    this.errorMessage = "";
    this.showLoginPage = true;
  }

  locationSeleted(event) {
    console.log("here : ", event);
    this.user.lat = event.coords.lat;
    this.user.lng = event.coords.lng;
    this.locationSelected = true;

  }

  onDateChanged(event: IMyDateModel) {
    this.user.dob = new Date(event.date.year, event.date.month - 1, event.date.day);
  }

  showRegisterPage() {
    this.showLoginPage = false;
    this.user = new UserDetail("", "", "", null, this.defaultLat, this.defaultLng);
    this.errorMessage = "";
    this.locationSelected = false;
  }

  logoff() {
    this.showLoginPage = true;
    this.errorMessage = "";
    this.user = new UserDetail("", "", "", null, this.defaultLat, this.defaultLng);
    this.isUserLoggedIn = false;
    this.locationSelected = false;
  }

  login() {

    if (this.user.emailId.trim() === "") {
      this.errorMessage = "Email Id is mandatory."
      return;
    }

    if (this.isValidEmail()) {
      this.errorMessage = "Email Id is not valid."
      return;
    }

    if (!this.isUserExist()) {
      this.errorMessage = "User does not exist. Please register."
      return;
    }
    this.user = this.userList.find(a => a.emailId === this.user.emailId.toLowerCase().trim());
    var tempDate = new Date(this.user.dob.year, this.user.dob.month, this.user.dob.day, 0, 0, 0, 0);

    this.modelDate = {
      date: {
        year: tempDate.getFullYear(),
        month: tempDate.getMonth(),
        day: tempDate.getDate()
      }

    };
    this.isUserLoggedIn = true;
    this.showLoginPage = false;
    this.errorMessage = "";
    this.locationSelected = true;
  }

  register() {

    if (!this.fieldsValid()) {
      return;
    }

    if (this.isUserExist()) {
      this.errorMessage = "User already exist. Please try with different email id."
      return;
    }

    this.user.dob = this.modelDate.date;

    this.userList.push(new UserDetail(this.user.firstName.toLowerCase().trim(), this.user.lastName.toLowerCase().trim(), this.user.emailId.toLowerCase().trim(), this.user.dob, this.user.lat, this.user.lng))
    localStorage.setItem("demoUserList", JSON.stringify(this.userList));

    this.locationSelected = true;

    this.isUserLoggedIn = true;
  }

  updateDetails() {
    this.user.dob = this.modelDate.date;

    this.userList.splice(this.userList.findIndex(a => a.emailId === this.user.emailId.toLowerCase().trim()), 1, this.user);

    localStorage.setItem("demoUserList", JSON.stringify(this.userList));
    this.locationSelected = true;
  }

  fieldsValid(): boolean {

    if (this.user.firstName.trim() === "" || this.user.lastName.trim() === "" || this.user.emailId.trim() === "" ||
      this.modelDate === undefined || this.modelDate === null) {
      this.errorMessage = "All the fields are mandatory."

      return false;
    }

    if (this.isValidEmail()) {
      this.errorMessage = "Email Id is not valid."
      return false;
    }

    return true;
  }

  isValidEmail(): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(this.user.emailId).toLowerCase());

  }

  isUserExist(): boolean {

    if (localStorage.length > 0) {
      this.userList = JSON.parse(localStorage.getItem("demoUserList"));
    }

    if (this.userList === null) {
      this.userList = new Array<UserDetail>();
      return false;
    }

    if (this.userList.find(a => a.emailId === this.user.emailId.toLowerCase().trim()) === undefined) {
      return false;
    }

    return true;
  }

}
