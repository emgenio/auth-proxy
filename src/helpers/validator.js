var ruleFunctions = {
    present: function (key, value) {
        var errors = [];
        var result = false;
        if (typeof value == 'undefined') {
            errors.push("The field '"+key+"' must be provided.");
        }

        result = !errors.length;
        return [result, errors] 
    },

    min_length: function (key, value) {
        var errors = [];
        var result = false;

        if (value.length < this.parameters) {
            errors.push("The field '"+key+"' must have a length of "+this.parameters);
        }

        result = !errors.length;
        return [result, errors];
    },

    valid_values: function (key, value) {
        var errors = [];
        var result = false;

        if (this.parameters.indexOf(value) === -1) {
            errors.push("The field '"+key+"' is not an accepted value");
        }

        result = !errors.length;
        return [result, errors];
    }
}

module.exports = {
    _validators: ruleFunctions,

    validateFields: function (object) {
        var errors = [];
        var result = false;
        for (var fieldName in this) {
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
    }
}
