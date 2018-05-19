This Project aims to reduce the burden placed on the people with dementia and their caretakers.
The Device is able to identify people that the patient meets and list them in the mobile application

Tools:
Python
  face_recognition
  pyrebase
Ionic 3
Angular 4
Firebase
  storage
  database
  
Device:
  1. Raspberry Pi Model B
  2. PiCamera
  3. two buttons
  4. one LED bulb
   (and some jumper wires)
  
  How it Works:
  
  The Application:
  
  The Device:
  
    The face recognition keeps running, and when the user wants to take a picture or record a video, the script stops the facial
    recognition and takes a picture or video and then continue the facial recognition.
    
    Taking a Picture
      When the user press the button, an image is taken using the camera and stored locally in the raspberry pi. Then that file is
      uploaded to the firebase. Once it is uploaded the file will be deleted from the local storage (to conserve the local storage memory).
      
     Taking a Video
      When the user press the button, the LED bulb will light up to indicate a video is being taken. The video is stored in the local 
      storage as a .h264. Then it is converted to MP4, after converting the file will be uploaded to firebase and the files stored 
      locally will be deleted. After this the LED bulb will turn off to indicate that the video has been taken and uploaded to firebase.
     
     Facial Recognition
      The Member List from firebase will be loaded in an array. Then it will be cross checked with the faces that has been identified
      from the frame taken from camera. If any of the faces match, the data will be updated in firebase.
      To install the face_recognition python library, follow this link: https://github.com/ageitgey/face_recognition
