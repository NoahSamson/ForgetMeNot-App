import { Members } from './members.model';
import { Assets } from './assets.model';

export interface User{
    // Common for all users
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    DOB: Date;
    phoneNum: string;
    profilePic: string;

    //Specific for patient users
    caretaker: string;
    member: Members[];
    curLocLat: number;
    curLocLong: number;
    radius: number;
    assets: Assets;
    center: any;
    role: string;

    //Specific for caretaker users
    patient: string;
}