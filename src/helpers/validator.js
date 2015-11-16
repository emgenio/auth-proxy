/** Rule Functions */
/**
 * Checks to make sure the specified field is present
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var present = function present (key, value) {
    var errors = [];
    var result = false;
    if (typeof value == 'undefined') {
        errors.push("The field '"+key+"' must be provided.");
    }
    return errors;
};

/**
 * Checks to see if the specified field reaches the
 * minimum length.
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var minLength = function minLength (key, value) {
    var errors = [];
    var result = false;

    if (value.length < this.parameters) {
        errors.push("The field '"+key+"' must have a length of "+this.parameters);
    }

    return errors;
};

/**
 * Checks to make sure the field is an
 * acceptable value.
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var validValues = function validValues (key, value) {
    var errors = [];
    var result = false;

    if (this.parameters.indexOf(value) === -1) {
        errors.push("The field '"+key+"' is not an accepted value");
    }

    return errors;
};

/** Begin Class */

var Validator = function Validator () {
    this._ruleFunctions = {
        required: present,
        minLength: minLength,
        hasValues: validValues
    }
}

/**
 * So we don't have to make the implementation worry about bind
 * @param {[type]} rule_table [description]
 */
Validator.NewValidator = function NewValidator (rule_table) {
    return new (Validator.bind(rule_table))();
};

/**
 * Validates the fields against the rule table
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
Validator.prototype.validate =  function validate (object) {
    var errors = [];
    var result = false;
    for (var fieldName in this) {
        if (fieldName == '_ruleFunctions') {
            continue;
        }

        var rules = this[fieldName];
        for (var ruleName in rules) {
            if (ruleFunctions.hasOwnProperty(ruleName)) {
               var context = {
                    parameters: rules[ruleName]
               };
               var err = ruleFunctions[ruleName].bind(context, fieldName, object[fieldName])();
               if (err[0] != true) {
                   errors = errors.concat(err[1]);
               }
            }
        }
    }
    
    result = !errors.length;
    return [result, errors];
};

/**
 * Adds a rule function to the existing rules. Can overide existing
 * rules.
 * @param {[type]} name  [description]
 * @param {[type]} value [description]
 */
Validator.prototype.addRule = function addRule (name, value) {
    if (toString.call(value) != '[object Function]') {
        return false;
    }

    this._ruleFunctions[name] = value;
    return true;
}

module.exports = Validator;