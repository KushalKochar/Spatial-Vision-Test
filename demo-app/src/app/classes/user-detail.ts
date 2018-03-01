export class UserDetail {
    firstName: string;
    lastName: string;
    emailId: string;
    dob: any;
    lat: number;
    lng: number;


    constructor(firstName: string, lastName: string, emailId: string,dob: Date, lat: number, lng: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.dob = dob;
        this.lat = lat;
        this.lng = lng;
    }
}
