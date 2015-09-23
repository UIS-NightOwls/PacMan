# PacMan
Download and install GitHub Desktop

Once installed go back to https://github.com/UIS-NightOwls/PacMan

Click on Clone in Desktop near the bottom right

This will open GitHub Desktop and ask where you want it cloned to

  Clone as: PacMan

  Tags:

  Where: Some workspace

Click Clone


Open IntelliJ

Click Open and go to the directory you created (Clone as)

This might ask you to register the root directory under vcs, just click yes.

Here is the project! YAY!

I have already created a couple branches.

Master - default

prod - our production release

uat - a functioning branch used for testing

develop - used for current development

We will each branch off of the develop branch with our on branches for development.

For now you can create your own branch FROM DEVELOP! from GitHub Desktop (I recommend watching the 30 second tutorial) and naming it yourname-feature-branch

so mine would be zweifel-feature-branch. Click publish so the branch goes to github online

Now in intelliJ near the top right you should see a VCS with a green up arrow. This is the commit button.

Before commiting any changes ensure you are on your branch and not on the master branch!

In the bottom right corner you should see Git:master. Click on this and you will also see your feature branch, select your branch (and create a local copy if needed). If you do not see your branch and you did already publish it, go back up to the top of the page and click the blue down arrow VCS. This will pull all remote changes and update your intelliJ package. Now go back to the bottom right and go to your branch.

Now you can make changes all you want. Once ready click the commit button in IntelliJ (VCS green up arrow). Review your changes and give some sort of commit message at the bottom of what you did. Then commit your changes.

Back in GitHub Desktop you can also commit if you have not done so. Then go to Repository and then push. This will put your changes on github for us to see. 

Let me know if anyone has questions

Demo:
The prod branch automatically deploys to the production server on any commit:
Temp URL (We should get a domain name):
http://pacman.michaelauchterlonie.com
