## Problem
- No specific tools in the market for students (all other options are generic with way too many auxiliary features that can overwhelm first time journallers)

- Too many links for classes to keep track of (to include zoom links, and all the different sites that instructors may use)

- Hard to keep track of online assignments and due dates  with remote learning (not as much reminders provided compared to in person instruction)   


## Our Solution & Purpose
We want to create a bullet journal that will help users keep track of their academic life.

We want to create a “single source of truth” for users to keep track of classes, such as specific class sites, zoom links, schedule of office hours.

Our product will be capable of rapid logging, organizing thoughts and ideas, and planning for the future.


## Risks and Rabbit Holes
#### Focusing too much on design over functionality
- Need to ensure we have a set time for how long we spend on a design and not go over
- Worry about perfecting the css / design after functionality has been implemented


#### Rabbit Hole: User login
- Implementing user login with unfamiliar framework
  - Account creation, and management
  Understanding how journal data is stored
  - SOL: Usage of MongoDB
    - Mark has prior experience with this database
    - RISK: bus factor too low

- Focusing too much on what login services are available to the user (ie. Sign in with Google, etc)
  - Understanding how to incorporate it into our sign-in procedure
  - Identifying possible side effects of 3rd-party services (ie. mining of user info, data breaches, etc.)
  - SOL: May forgo usage of 3rd-party logins


#### The Dashboard
- Hole in the concept
  - Want it to be something that can be easy to look at while getting all necessary and relevant information from your book
  - Started with a summary of Today's list, calendar, alerts, small version of collections and index on the left, upcoming dates, all editable, (+ more)
  - **Cut Back** on almost everything. 
    - To make the interface more usable for the user
    - More reasonable to implement for developers
    - Remaining concerns:
       - Want to make sure that the user can easily and quickly start typing (adding bullets/notes) from here (less clicks to get to where you want, be straightforward)

- Calendar
  - Meet with expert 
    - Initial confusion on how the system would be set up with different school schedules with addition of having daily log in the dashboard
      - Clarification with mentor to have it auto-generated

Implementing features that could potentially distract from the core functionality of the bullet journal. We would avoid this by always keeping our main plan in sight and in mind, making sure that every step we take leads us towards our shared vision of the user’s wants and needs. We also want our bullet journal to be as easy to use as possible, so anything that is not essential or addresses one of persona’s concerns would be implemented afterwards.

#### Over ambitious features
- There is always a risk of our features being out of the scope of our programming expertise or being too time consuming to implement that it hinders the production of the product
- One such example of this could be our idea of implementing a block style text editor that automatically categorizes blocks of text as notes, events or tasks based on the initial character typed, and being able to add tags to specific blocks
- One way to mitigate this is if we realise throughout the sprint that a certain feature was starting to get backlogged, even with more engineers added on to help solve the issue, we must take a step back to simplify the feature and implement a more basic version of the feature (if it is core) or may even decide as a team if it’s best to remove it from the final product altogether. 


## Wireframes
[insert image here]

## User Personas and Stories

[insert image here]
### Name: Mark Liang
Mark is a 3rd year biology major, who works two jobs. He has never used a bullet journal before. He is from UCSD, within Revelle College and needs 2 more years to graduate. He has an overall GPA of 2.8. He likes to attend social events, and surf. He wishes to someday attend Med School and pursue a higher education in biology. 

As a person, he’s a forgetful procrastinator that is very flexible and adaptable depending on the situation. He is very sociable and motivated when he wants to be.He doesn’t have too much experience with technology, except for using zoom and watching Netflix. His understanding of technical skills is sustainable and adequate. 

Currently, he wants to be able to organize and manage his daily tasks. Additionally, he has trouble keeping priority of his tasks. Although he wants to maintain his work flow, he doesn’t want to waste too much time journaling. He doesn’t want to use any methods that are too complicated and time consuming. 

By using our product, Mark would be able to easily create and link tasks for any classes that he’s taking. Our design would be user friendly and straight to the point, so that he doesn’t feel overwhelmed by journaling. In order to accommodate for Mark’s forgetfulness, our app will contain dates and reminders that will notify users of upcoming tasks. Our app will contain daily, weekly, and quarterly logs in order to help Mark keep track of his priorities.  




[insert image here]
### Name: Trai Suraj
Traj is a first year lit major who is not the most familiar with technology. He likes having everything on paper rather than digitally and enjoys reading books over electronic media. His minimal dependence on technology even transfers over to his non-academic life, as he prefers to ride a bike rather than using other means of transportation.

As a person, Trai is creative, disciplined, studious, focused, and reserved. All of these personality traits combined have helped him achieve a 4.0 GPA. He enjoys reading, writing, poetry, birdwatching, and nature. Trai is particularly good at writing poetry, knitting, and has good memory retention. 

With the onset of Covid, Trai realized that he could organize his classes much more efficiently with a digital bullet journal. His lack of familiarity with online materials proved to be a disaster when classes moved online. He is interested in something that is intuitive to use, allows him to link notes and tasks with certain classes, allows him to keep track of all links in one place, and has a high contrast mode.

Traj is concerned about his minimal experience with technology preventing him from transitioning to a digital bullet journal and his partial color blindness from letting him properly use it. 



[insert image here]
### Name: Susanna Kim
Susanna is a second year arts major and is an avid user of an analog bullet journal. She runs a bullet journaling blog online, where she does bullet journal reviews and has a large following of 10k. She is also a student mentor. 

As a person, Susanna is patient and outgoing, but her personality shines in being artsy and detail oriented. Aside from taking care of plants, she takes on interests in graphic design and bullet journaling. She has a moderate knowledge about technology as she runs a blog and has a status on social media. 

With technology growing faster than ever, Susanna wanted to catch up with the current times and transition more towards technology. Specifically, she wants to transition into using a digital bullet journal. Since she is used to using technology, her main concerns with using a digital bullet journal lie in the degree of personalization she is allowed, and its effectiveness compared to the analog form, of which she is much more experienced with.

By using our product, Susanna will be able to continue to enjoy the personalization that comes with the analog bullet journal, having the ability to pick colors and fonts to her liking, along with adding stickers and other images. With our product she may find that the digital bullet journal is more convenient due to not having to worry about human-made writing errors, along with the digital medium being faster overall thanks to our rapid logging and task migration features.


## Projected Timeline
**Sprint 1** - Core bullet journal functionality (adding tasks, indexing, tagging collections, database)

**Sprint 2** - Add customizability and other secondary features (Finish MVP)

**Sprint 3** - Feature lock and iron out kinks (increase code coverage, ux/ui, testing)

Keeping in line with our main plan, it’s imperative that we don’t lose focus on our main objective, which is to create a bullet journaling system for students. Hence, that will be the main focus throughout the first two sprints, adding extra customizability features as we see fit. Towards the later weeks of the quarter, we want to lock our feature list and commit to creating the best possible experience we can provide to users with the features that have been implemented, keeping in mind to continually test code and write documentation.
