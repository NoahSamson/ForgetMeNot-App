#!/bin/sh

#HCI
#The video recording takes time to upload depending on the length of the recording and the user does not know if
#the device is recording or not. Therefore, the IOT has a led that lights up when the device starts recording and stops when the file is uploaded.
#The start up process takes a while so the led will be lit up until the device is ready to be used.
#The facial recognition has to running all the time and that will be using the camera so the user wont be able to take a picture or record. Therefore, I stopped the facial
#recognition when either button is pressed and start it again when that process is finished. The facial recognition can not be used when taking a picture or recording a video.
#The process runs in a infinite while loop so that the process will keep on running. And this script will run on pi boot so that the user can just connect the pi to power and
#the script will run. There is no power button so the pi will start when power is supplied and stop when the power stops.

#import picamera
import face_recognition
import picamera
import numpy as np

#import firebase and initialise firebase
import pyrebase

# IMport GPIO Library
import RPi.GPIO as GPIO

#import time for filename
import time

#import subprocess
from subprocess import call

#import os to remove file from pi
import os

import urllib.request

#import twilio for messaging

#config = {
  #"apiKey": "AIzaSyCtsIcBb0zUkS-x4egUf5fNNqn4A8khLkI",
  #"authDomain": "forgetmenot-7b63c.firebaseapp.com",
  #"databaseURL": "https://forgetmenot-7b63c.firebaseio.com",
  #"storageBucket": "forgetmenot-7b63c.appspot.com"
#}

current_milli_time = lambda: int(round(time.time() * 1000))
#Class of Member

class Member:
    def __init__(self, name, relationship, profPic, location, timeLastSeen, date):
        self.name = name
        self.relationship = relationship
        self.profPic = profPic
        self.location = "Sri Lanka"
        self.timeLastSeen = timeLastSeen
        self.date = date

#List to contain all the members known by the user
memberList = []




GPIO.setwarnings(False) #Ignore wrning for now
GPIO.setmode(GPIO.BOARD) # Use Physical pin numbering
# set pin 10 for image capture to be an input pin and set inital value to be pulled low (off)
GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
# set pin 12 for video capture to be an input pin and set inital value to be pulled low (off)
GPIO.setup(12, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
#set pin 8 for led out put to indicate video capture
GPIO.setup(8, GPIO.OUT)

GPIO.output(8, GPIO.HIGH)


config = {
    "apiKey" : "AIzaSyDPzDf5rnyf7T7GYveAEBtwPnP4D6qHHxo",
    "authDomain" : "fmn-sr.firebaseapp.com",
    "databaseURL" : "https://fmn-sr.firebaseio.com/",
    "storageBucket" : "fmn-sr.appspot.com"
}

firebase = pyrebase.initialize_app(config)
           
auth = firebase.auth()
#authenticate a user
user = auth.sign_in_with_email_and_password("sam@gmail.com", "1234567")

#initiate storage
storage = firebase.storage()

#initiate database
db = firebase.database()

ref = db.child("users").child(user['localId'])

#testfile = urllib.URLopen()

#Aded all the members in firebase to the memberList
mems = db.child("Members").get()
for mem in mems.each():
    print(mem.val().get("firstName"))
    #testfile.retrieve(mem.val().get("profPic"), mem.val().get("firstName")+".jpg")
    memberList.append(Member(mem.val().get("firstName"), mem.val().get("relationship"), mem.val().get("profPic"), "Sri Lanka", time.strftime("%d/%m/%Y %H:%M"), current_milli_time()))

#userInfo = auth.get_account_info(user['idToken'])

#variablses
#Current DateTime
timestr = ""
camera = picamera.PiCamera()
camera.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)

#Capture an image and upload to firebase with the name as the current datetime
def capture():
    global camera
    #with picamera.PiCamera() as camera:
    timestr = time.strftime("%Y%m%d%H%M%S")
    curDate = time.strftime("%d/%m/%Y %H:%M")
    camera.capture("/home/pi/Documents/FMN/"+ timestr+".png")
    print("Pic taken")
    storage.child("pi/"+timestr +".png").put("/home/pi/Documents/FMN/"+timestr+".png", user['idToken'])
    print("file sent")
    fbPath = storage.child("pi/"+ timestr+".png").get_url(1)
    userdbRef = firebase.database().child("users/").child(user['localId']).child("/Assets/Gallery")
    userdbRef.push({"URL": fbPath, "date" : curDate, "name": timestr, "type": "image/png"})
    path = "/home/pi/Documents/FMN/"+ timestr +".png"
    os.system('rm ' + path)
    recog = True
        
#Record video and ipload to firebase with the name as the current datetime
def recordVideo():
    global camera
    #with picamera.PiCamera() as camera:
    timestr = time.strftime("%Y%m%d%H%M%S")
    curDate = time.strftime("%d/%m/%Y %H:%M")
    camera.start_preview()
    camera.start_recording("/home/pi/Documents/FMN/"+ timestr+".h264")
    GPIO.output(8, GPIO.HIGH)
    print("Record Started")
    
    GPIO.wait_for_edge(12, GPIO.RISING)
    camera.stop_recording()
    camera.stop_preview()
    print("Record Ended")
    print("Converting")
    #define command
    command = "MP4Box -add "+timestr+".h264 " + timestr+"MP.mp4"
    #execute Command
    call([command], shell=True)
    print("Video Converted")
    storage.child("pi/"+timestr +".mp4").put("/home/pi/Documents/FMN/"+timestr+"MP.mp4", user['idToken'])
    print("File Sent")
    fbPath = storage.child("pi/"+ timestr+".mp4").get_url(1)
    userdbRef = firebase.database().child("users/").child(user['localId']).child("/Assets/Gallery")
    userdbRef.push({"URL": fbPath, "date" : curDate, "name": timestr, "type": "video/mp4"})
    #So that the user know that the video is still uploading
    GPIO.output(8, GPIO.LOW)
    path = "/home/pi/Documents/FMN/"+ timestr+".h264"
    mpPath = "/home/pi/Documents/FMN/"+timestr+"MP.mp4"
    os.system('rm ' + path)
    os.system('rm ' + mpPath)
    recog = True
        




# Load a picture 
print("Loading known face images")
#ram_image = face_recognition.load_image_file("Ram.jpeg")
#ram_face_encoding = face_recognition.face_encodings(ram_image)[0]

#print(ram_face_encoding)

#pradeepa_image = face_recognition.load_image_file("Pradeepa.jpeg")
#pradeepa_face_encoding = face_recognition.face_encodings(pradeepa_image)[0]

#raghu_image = face_recognition.load_image_file("Raghu.jpeg")
#raghu_face_encoding = face_recognition.face_encodings(raghu_image)[0]

#noah_image = face_recognition.load_image_file("Sam.jpeg")
#noah_face_encoding = face_recognition.face_encodings(noah_image)[0]

#known_faces = [
#    ram_face_encoding,
#   pradeepa_face_encoding,
#    raghu_face_encoding,
#    noah_face_encoding
#]
known_faces = []

#Iterate through a loop to load the images in the array
for members in memberList:
    if(members.profPic != ""):
        urllib.request.urlretrieve(members.profPic, members.name+".jpg")
        image = face_recognition.load_image_file(members.name+".jpg")
        #print(members.name+ ".jpg")
        face_encoding = face_recognition.face_encodings(image)[0]
        known_faces.append(face_encoding)
        #print(members.name + "jpg")

# Initialize some variables
face_locations = []
face_encodings = []

face_names = []

recog = True
curDate = time.strftime("%d/%m/%Y %H:%M")
#userdbRef = firebase.database().child("users/").child(user['localId']).child("/PeopleMet")

GPIO.output(8, GPIO.LOW)
#to keep the pi listening
while True:
    print("start")
    #if recog == True:
        #faceRec()
    #if GPIO.input(10) == 1:
        #capture()
    #if GPIO.input(12) == 1:
        #recordVideo()
    print("Capturing image.")
    recog = True
    
    #HCI
    #The user needs to be in a fairly lit place for the facial recognition to be accurate
    #The user needs to place the camera where it can see the people that the user is facing
    #The user can then check the app People I Met to see the people whom he has met, and it will also show the date and time he met them.
    while recog:
        print("Capturing image.")
    
        # Grab a single frame of video from the RPi camera as a numpy array
        
        camera.capture(output, format="rgb")
        camera.start_preview()
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(output)
        print("Found {} faces in image.".format(len(face_locations)))
        face_encodings = face_recognition.face_encodings(output, face_locations)
        
        face_names = []
        
        nameString =""
        

        # Loop over each face found in the frame to see if it's someone we know.
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            match = face_recognition.compare_faces(known_faces, face_encoding)
            name = "<Unknown Person>"
            print(match)

            #if match[0]:
                #name = "Ram"
                #name = memberList[0].name
                #firebase.database().child("users/").child(user['localId']).child("/PeopleMet").push({"name": name, "date" : curDate, "location": "Sri Lanka", "profPic": "", "relationship": ""})
            #elif match[1]:
                #name = "Pradeepa"
                #firebase.database().child("users/").child(user['localId']).child("/PeopleMet").push({"name": name, "date" : curDate, "location": "Sri Lanka", "profPic": "", "relationship": ""})
            #elif match[2]:
                #name = "Raghu"
                #firebase.database().child("users/").child(user['localId']).child("/PeopleMet").push({"name": name, "date" : curDate, "location": "Sri Lanka", "profPic": "", "relationship": ""})
            #elif match[3]:
                #name = "Noah"
                #firebase.database().child("users/").child(user['localId']).child("/PeopleMet").push({"name": name, "date" : curDate, "location": "Sri Lanka", "profPic": "", "relationship": ""})

            
            
            for i in range(len(memberList)):
                if match[i]:
                   name = memberList[i].name
                   firebase.database().child("users/").child(user['localId']).child("/PeopleMet").push({"name": memberList[i].name, "date" : curDate, "location": "Sri Lanka", "profPic": "", "relationship": ""})
                   
            print("I see someone named {}!".format(name))  
            
            
            #for member in MemberList:
               # if match[increment]:
                    #name = member.name
                    #increment = increment + 1
                #else:
            
        
        #The user can press either button,
        #When the user presses the first button, the camera takes a picture and send the image to firebase
        #When 
        if GPIO.input(10) == 1:
            recog = False
            capture()
        if GPIO.input(12) == 1:
            recog = False
            recordVideo()

#Clean Up
GPIO.cleanup()

