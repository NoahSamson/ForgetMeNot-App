import { Caretaker } from './caretaker.model';
import { Members } from './members.model';
import { Assets } from './assets.model';

export interface Patient{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    DOB: Date;
    phoneNum: string;
    caretaker: Caretaker;
    member: Members[];
    profilePic: string;
    curLocLat: number;
    curLocLong: number;
    radius: number;
    assets: Assets;
    center: any;
    role: string;
}