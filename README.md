# login

Standardized login page for all EngSoc services, including courses.skule.ca.

Supports:
- email link authentication (used to enforce student access)
- Google authentication (used for admin access through @skule.ca accounts)

## Usage

Include as submodule. Requires firebaseConfig.js to be located in main project root. Direct users to submodule folder and append `?redirect=` to direct the logged in users to the intended location.
