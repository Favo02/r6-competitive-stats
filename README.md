# Rainbow six siege competitive stats

*Incomplete* webapp to manage competitive R6S stats generated by **R6Analyst**.

## Deploy:
~~Deployed at: https://favo02-compstats.herokuapp.com/~~ *RIP Heroku free hosting*

## Preview:
Home page: registered matches\
<img src="https://user-images.githubusercontent.com/59796435/221357899-173878af-1563-43bd-8ca0-e6a5448254b0.png" width=750 height=500 />

Teams page: manage your teams\
<img src="https://user-images.githubusercontent.com/59796435/221357901-65d30c54-a11f-47a3-b852-23fe61300168.png" width=750 height=500 />

Profile page: manage your profile\
<img src="https://user-images.githubusercontent.com/59796435/221358380-76a614fa-b739-4871-9bae-d94670e68ff4.jpg" width=750 height=500 />

## Stack:

- **Languages**: `html`, `css`, `javascript`

- **Frontend framework**: `react`
- **Styling**: `scss` *(css)*, `css modules` *(css)*, `fontawesome` *(icons)* 
- **Routing**: `react-router-dom`

- **Backend**: `express` *(rest API)*, `mongoose` *(models)*, `jwt` *(auth tokens)*
- **Database**: `mongodb`

![](https://skillicons.dev/icons?i=html,css,javascript,react,tailwind)

## Commit, Branch and Pull request convention:

### **Commit**:

Commit message convention: `<scope>: <type><summary>`

Scope: `Frontend`, `Backend`, `Both`, `Build`\
Type: `bug fixes`, `refactor`, `docs`, `CSS`\
Summary: short summary in past tense, not capitalized, no period at the end

Example: `Frontend: CSS: added header background color`

### **Branch**:
Create a new branch for new features. Branch name should be self explanatory.\
*It is possible to not to create the new branch for single-commit fixes or small modifications.*

Example: `add-footer`

### **Pull request**:
When the feature is ready and stable merge the branch locally and push it. No pull requests.
