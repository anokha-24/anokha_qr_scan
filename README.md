# Anokha Event Attendance

Built for Anokha Event Organizers/Admins, this application allows you to take attendance of participants in events, ensuring that only registered participants are allowed to enter or exit the respective event. Additionally, entry and exit at the main gate can be recorded and controlled.

## How to use it

1. https://docs.google.com/document/d/e/2PACX-1vQ0RLywif-fNLVOdynzpOan68T8PDGxBnF60MCaoZdpbq-oV8pn8McHoh1QYqIxouDUgWoXnyzJ53oP/pub
2. https://docs.google.com/document/d/e/2PACX-1vTkdbwPl2IwI5F-hq5VPNWEUc-5EyIu3oTmMcY0EGEWL4MVDI6XLC_F64K0e4NSO7RJysm2MVS16fdI/pub

## Features

- [x] Admins/EventOrganizers/AttendanceTakers can login to the app.
- [x] Gate Entry/Exit can be marked via QR Code Scanning.
- [x] Events associated with the logged in user are displayed.
    - [x] Display the events the logged official can take attendance for.
    - [x] Select the event to take attendance for.
- [x] Take Attendance Screen.
    - [x] QR Code Scanner to scan the QR Code of the participant.
        - [x] Scan QR with camera.
        - [x] Upload QR screenshot to take attendance.
        - [x] Start/Stop Camera to scan QR can be controlled.
    - [x] Response after scanning the QR Code displayed through an alert message.

## Tech Stack

- [x] HTML5
- [x] CSS3
- [x] JavaScript

## Open Source Libraries Used

- [HTML5-QRCode](https://github.com/mebjas/html5-qrcode)

## How to run the project?

1. Clone the repository.
2. Open the project in your favorite code editor.
3. Follow the steps below to run the project.
    1. `Event Attendance` - Open the `index.html` file in your browser.
    2. `Gate Entry/Exit` - Open the `index.html?wtf=0` file in your browser (wtf=0 is a query parameter to differentiate between the two functionalities).

Built with ❤️ by Ashwin Narayanan S.
