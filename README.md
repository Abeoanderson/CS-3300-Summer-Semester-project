# CS-3300-Summer-Semester-project
work for our summer CS 3300 semester project:
Sprint 1: set up project with base components
  Components:
    header.tsx
      mostly done
    footer.tsx
      mostly done
    mealLogger.tsx
      mostly done
    Navbar.tsx
      mostly done
    updateWeight.tsx
      created
    workoutlogger.tsx
      mostly done
  router pages:
    about.tsx
      mostly done
    home.tsx
      mostly done 
    login.tsx
    signup.tsx
    notFound.tsx
Sprint 2: implement saving meal features and a database
Sprint 3: implement user profiles and a search query
Sprint 4: add target adjustment and other visualization goals
Sprint 5(if time allows): add camera api for barcode tracking, refine UI based on previous feedback


Usage:

step1: run server on node /CS 3300 Project src/server.js

step 2: run front end on npm run dev, while in CS 3300 Project

step 3: open local host in browswer

features:

Calorie Tracking: Easily log and visualize daily caloric intake.
- as the trainee I want to track my calories and visualize daily caloric intake so that I can see my trends over the weeks/months and adjust my intake to reflect my goal
- as the coach I want my Client to be able to track thier calorories so I can see that they are sticking to the plan
- measurable though days tracked and reliability of being to access preivous days at-least a month back
<img width="986" height="805" alt="image" src="https://github.com/user-attachments/assets/84e2208a-98fa-4621-a6be-943ea7bd6381" />
<img width="891" height="876" alt="image" src="https://github.com/user-attachments/assets/27e74e16-0b06-47ac-855d-42899d54a24d" />

Weight Tracking: Chart progress and visualize weight changes over time.
- as the trainee I want to track my weight and see its trend over time so that I can see if the macros I am eating are working
- as the coach I want my clients to be able to track their weight so I can get feedback on if they need adjustment
- measurable though days tracked and reliability of being to access preivous days at-least a month back

Personalized Feedback: Get recommendations based on individual weight gain or loss goals.
- as the trainie I want to be able to get personalized feedback from my coach so that I know how to continue with my routine over the time till my goal
- as the coach I want to be able to give personalized feedback based on my clients tracked stats/macros so that they can progress efficiently and pain free
- measurable though feedback popping up quick(within 5 min) and being persistant
<img width="585" height="177" alt="image" src="https://github.com/user-attachments/assets/d1bdc825-2d35-49cb-9663-834abc2a0db8" />

Secure User Login: A personal, secure environment for every user to track their journey. 
- as the trainee I want my tracked info to stay private as that is a hipaa violation
- as a coach I want my clients info and conversations with me to stay private so that their privacy is protected
- measurable though auth and auth working and being decienlty hard to break into
<img width="1170" height="507" alt="image" src="https://github.com/user-attachments/assets/9ef45de7-c35d-471e-ab78-428cce04926a" />

Gamified Achievements (Optional): Unlock badges and rewards to stay motivated and track milestones.
- As the trainee I would like achievements to represent my work so that I know I am progressing
- as the coach I like the achievements so that they can give my clients motivation and celebrate milestones.
<img width="588" height="148" alt="image" src="https://github.com/user-attachments/assets/d386e59d-c018-421a-a29b-6a422cbe0f14" />
<img width="794" height="590" alt="image" src="https://github.com/user-attachments/assets/2e3b69a8-f570-4956-995b-2f14ec3f123c" />

SRS functional vs non-functional requirements - for final project

functional:
Secure User Login: A personal, secure environment for every user to track their journey. 
- as the trainee I want my tracked info to stay private as that is a hipaa violation
- as a coach I want my clients info and conversations with me to stay private so that their privacy is protected
Weight Tracking: Chart progress and visualize weight changes over time.
- as the trainee I want to track my weight and see its trend over time so that I can see if the macros I am eating are working
- as the coach I want my clients to be able to track their weight so I can get feedback on if they need adjustment

security: a secure space to track stuff
robustness: info isn't lost, and is backed up securely + long term
reusability: setup for new clients shouldn't be hard
