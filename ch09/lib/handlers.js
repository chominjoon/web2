// slightly modified version of the official W3C HTML5 email regex:

const { signedCookie } = require("cookie-parser")

// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

class newsletterSignup {
    constructor({ name, email }) {
        this.name = name
        this.email = email
    }
    async save() {

    }
}

exports.home = (req, res) => {
  console.log("home handler")
  donut = req.cookies.donut
  signedDonut = req.signedCookies.signed_donut
  if (!donut) {
      console.log("Cookie donut is not exist.")
      res.cookie('donut', 'yami', {maxAge: 100000})
  }
  else {
      console.log(`Cookie donut(${donut}) is exist.`)
      res.locals.cookieValue = donut
      res.cookie('donut', 'yami', {maxAge: 100000})
  }
  if (!signedDonut) {
      console.log("Cookie signed_donut is not exist.")
      res.cookie('signed_donut', '아주 맛있어', {signed: true, maxAge:150000})
  }
  else {
      console.log(`Cookie signed_donut(${signedDonut}) is exist.`)
      res.locals.signedCookieValue = signedDonut
      res.cookie('signed_donut', '아주 맛있어', {signed: true, maxAge:150000})
  }
  if (!req.session.visit) {
      req.session.visit = 1
  }
  else {
      req.session.visit = req.session.visit + 1
  }
  res.locals.visitNumber = req.session.visit
  console.log('mess')
  res.render('home')
}

exports.about = (req, res) => {
  console.log("about handler")
  res.render('about')
}

exports.notFound = (req, res) => {
  console.log("404 handler")
  res.render('404')
}

exports.serverError = (err, req, res, next) => {
  console.log("500 handler")
  res.render('500')
}

exports.about = (req, res) => {
  console.log("about handler")
  res.render('about')
}

exports.notFound = (req, res) => res.render('404')

exports.serverError = (err, req, res, next) => res.render('500')
exports.newsletterSignupProcess = (req, res) => {
    console.log("[DEBUG]handlers.js:newsletterSighnupProcess:start")
    const name = req.body.name || '', email = req.body.email || ''
    if(!VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The emaill address you entered was not valid.',
        }
        return res.redirect(303,'/newsletter-signup')
    }
    console.log("[DEBUG]handlers.js:newsletterSighnupProcess: name="+name+", email = "+email)
    new newsletterSignup({ name, email }).save()
    .then(() =>{
        req.session.flash = {
            type: 'success',
            intro: 'thank you!',
            message: 'You have now been signed up for the newsletter',
        }
        return res.redirect(303, '/newsletter-archive')
    })
    .catch(err => {
        req.session.flash = {
            type: 'danger',
            intro: 'Database error!',
            message: 'There was a database error; please try again later.',
        }
        return res.redirect(303, '/newsletter-archive')
    })
}
