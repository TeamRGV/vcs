# Version Control System
_____________________________________________________________

VCS is a web application integrated with command line to create repository and work on it by team members. Here we cloned and implemented 3 of git functions create-repo, check-in(commit), check-out(branch). The team members can check out the repository which creates a new branch and modify files inside it. After modifications, the team members can check-in the changes into the repository which is equivalent to git push. All the manifests are maintained with tree structure to rollback and for history.

<img src="/screenshots/Screenshot%20(81).png">

# Create Repo - 
Create a repository for the given project source tree(including all its files and their folder paths) using web application
or command Line. This will create a manifest file which will keep track of your source folder, destination folder, command used,
date and time, and all the files present in the repository with their respective Artifact ID's.

<img src="/screenshots/Screenshot%20(82).png">

# Check-out -
You can pull the repository from the server for making modifications by providing desired manifest file, branch name and destination 
path. This will copy the required repository to the target folder(i.e., branch name) provided and each check-out will create a manifest file for recording the checkout.

<img src="/screenshots/Screenshot%20(97).png">

# Check-in - 
Push the changes made to the repository by using check in functionality. Each check-in will create a manifest file to keep track of repository being pushed with other details of source path, destination 
path, date and time, and all modified files with their Artifact ID's.

<img src="/screenshots/Screenshot%20(102).png">

# External requirements:
Install Node on the system
Install visual studio code


# Installation and setup:

_____________________________________________________________

1. Go to https://nodejs.org/
2. Open the official page for Node.js downloads and download Node.js for Windows by clicking    the "Windows Installer" option.
3. Run the downloaded Node.js .msi Installer - including accepting the license, selecting the destination, and authenticating for the install.
4. To ensure Node.js has been installed, run node -v in your terminal - you should get something like v6.9.5.
5. Update your version of npm with nom install nom --global.
6. Copy the folder vcs 
7. Navigate to vcs from terminal and type following: 
	7a. npm install to intall all modules used
	7b. npm link for syslink npm as global variable
8. To run the web app enter following
	8a. node server.js
	8b. Open browser and follow Execution OR use command line.


# for visual studio code:
1. Download the Visual Studio Code installer for Windows.
2. Once it is downloaded, run the installer (VSCodeUserSetup-{version}.exe).
3. By default, VS Code is installed under C:\users\{username}\AppData\Local\Programs\Microsoft VS Code.


# Execution:

_____________________________________________________________

# Starting Web-application -

 1. Open command line and type node server.js to run the node server.

 2. Open your web browser and type http://localhost:8080/home



# Creating a repository -
 
 To create a repository, you can either use a web application or command-line

 ### Using Command Line 

 1. Go to source path where the repository to be created is present.

 2. Use command  -> vcs createrepo



 ### Using Web Application

 1. Select the create repo option on the home screen.

 2. Select the create repo button which will open an input field where you can type the name of the repo to be created.

 3. After providing the name of repo, you can proceed with the submit button which will create a repository.

 4. To further add folders and files, open the new repo created which will have a button to create file.

<img src="/screenshots/Screenshot%20(81).png">

# Check-out -

To check-out, you can use either a command line or web application.

### Using Command Line

 1. To  check-out you need to provide three arguments which are branch name, destination path and manifest file.

 2. Use command -> vcs checkout manifestFile branchName destinationPath
 

### Using Web Application-

 1. Select the check-out option from the home screen.

 2. Enter branch name, destination path and manifest file name in the input field provided.

 3. Proceed with the submit button which will copy the desired repository to the provided destination path.



# Check-in -
 To check-in the changes made, you can use either command line or web application.
 Using Command Line
 1. To check-in, go to the source folder path in command line.
 2. Use command -> vcs checkin

### Using Web Application -
 1. Select the check-in option from the home screen.
 2. Enter you complete source folder path in the input field provided.
 3. Proceed with the submit button which will push your changes to remote repository.

# Display Repository -
  Select this option on home screen which will display you repositories on the web application.
  
  <img src="/screenshots/Screenshot%20(106).png">

# Manifest Files -
 Select this option on home screen which will display list of all the manifest files.
 
 <img src="/screenshots/Screenshot%20(108).png">

# Add Label - 
 Add label to your manifest file in order to make it easier to remember and identify a particular snapshot of project. To add label, you can use either command
 line or web application.
 
 <img src="/screenshots/Screenshot%20(110).png">
 
### Using Command Line -
 1. To add label, you need to provide manifest file name and label.
 2. Use command -> vcs label manifestFileName label

### Using Web Application -
 1. Select Add Label option from the home screen.
 2. Enter manifest file name and label in the input fields.
 3. Proceed with the submit button which will add label to the manifest file provded.


# Features:
_____________________________________________________________

1. Our web application provides ability to create repository, check.
2. The entire source project tree folder (including its root folder) is replicated within the target repository root folder.
3. A manifest file (i.e., a  snapshot summary) for this command is create which incldes 
   3.1 command particulars (i.e., command used)
   3.2 source path and desination path
   3.3 date and time
   3.4 for each project source file a line describing that source file (AKA that artifact) in the project along with its project folder's relative path
   3.5 a label
4. Check out the repository from the server for making modifications by providing desired manifest file, branch name and destination path on you system. This can be 
   achieved using both command line interface and web application. This will create a respective manifest file to include all relevant details. All the source tree
   will be copied to the target folder(i.e. branch name).
5. Check in the changes made by using either command line or web application which will push the changes to remote repository. This will create a respective
   manifest file to include all relevant details. This will update the remote repository with the new changes made.  
6. In order to make it easier to remember and identify a particular snapshot of project, add a lable to manifest file. This can also be achieved using both
   the command line and web application by providin the manifest file name and label to be added.
7. Get all the repositories by selecting Display Repository on the home screen
8. Get the list of manifest files by selecting Manifest Files on the home screen.
9. Get description of the command by typing vcs command-name --help





___________________________________________________________________________________________________________________________________________________________________________________________
   
 











