function Validator(formSelector) {
  var formElement = document.querySelector(formSelector);
  var _this = this;
  var formRules = {};

  // Rules libraries
  var validatorRule = {
    required: function (value) {
      return value ? undefined : "nhập đi má, sao còn chưa nhập nữa má";
    },
    email: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Nhập email má ơi ";
    },
    min: function (min = 1000) {
      return function (value) {
        return value.length >= min
          ? undefined
          : "Nhập lại Mk đi má ơi (nhớ là trên 8 kí tự nho)";
      };
    },
    max: function (max) {
      return function (value) {
        return value.length <= max
          ? undefined
          : "Nhập ít thôi má ơi (nhớ là trên 8 kí tự nho)";
      };
    },
  };
  if (formElement) {
    function getParent(element, selector) {
      while (element.parentElement) {
        // match the parent element class with selector or not
        if (element.parentElement.matches(selector)) {
          return element.parentElement;
        }
        element = element.parentElement;
      }
    }
    // Lấy các input có rule và có name
    var inputs = document.querySelectorAll("[name][rules]");
    // lọc qua các input và lấy các giá trị trong rules và gán  vào trong formRule
    for (var input of inputs) {
      var rules = input.getAttribute("rules").split("|");
      for (var rule of rules) {
        // vào từng rule và nếu
        if (rule.includes(":")) {
          var ruleInfo = rule.split(":");
          if (Array.isArray(formRules[input.name])) {
            formRules[input.name].push(
              validatorRule[ruleInfo[0]](Number(ruleInfo[1]))
            );
          } else {
            formRules[input.name] = [
              validatorRule[ruleInfo[0]](Number(ruleInfo[1])),
            ];
          }
        } else {
          if (Array.isArray(formRules[input.name])) {
            formRules[input.name].push(validatorRule[rule]);
          } else {
            formRules[input.name] = [validatorRule[rule]];
          }
        }
      }

      /** ==============HANDLE EVENTS=============== */
      //  handle event on the input field
      input.onblur = handleValidate;
      input.oninput = handleErrors;

      // function that handles validation
      function handleValidate(event) {
        var rules = formRules[event.target.name];
        var errorMessage;
        for (var rule of rules) {
          errorMessage = rule(event.target.value);
          if (errorMessage) break;
        }
        console.log(errorMessage);
        if (errorMessage) {
          const notifyElement = getParent(
            event.target,
            ".form-group"
          ).querySelector(".form-message");
          notifyElement.innerText = errorMessage;
          getParent(event.target, ".form-group").classList.add("invalid");
        } else {
          getParent(event.target, ".form-group").querySelector(
            ".form-message"
          ).innerText = "";
          getParent(event.target, ".form-group").classList.remove("invalid");
        }
        return !errorMessage;
      }
      function handleErrors(event) {
        var formGroup = getParent(event.target, ".form-group");

        if (formGroup.classList.contains("invalid")) {
          formGroup.querySelector(".form-message").innerText = "";
          formGroup.classList.remove("invalid");
        }
      }
    }

    formElement.onsubmit = (event) => {
      event.preventDefault();

      var inputs = document.querySelectorAll("[name][rules]");
      var data = {};
      var isValid = true;

      for (var input of inputs) {
        if (
          !handleValidate({
            target: input,
          })
        ) {
          isValid = false;
        }
      }
      if (isValid) {
        //  trả về dữ liệu người dùng đã nhập
        const accountRegister = Array.from(inputs).reduce(
          (emulator, currentValue) => {
            switch (currentValue.type) {
              case "checkbox":
                if (currentValue.matches(":checked")) return emulator;
                if (Array.isArray(emulator[currentValue.name])) {
                  emulator[currentValue.name] = [];
                }
                emulator[currentValue.name].push(currentValue.value);

                break;
              case "radio":
                emulator[currentValue.name] = formElement.querySelector(
                  'input[name="' + currentValue.name + '"]:checked'
                ).value;
                break;
              case "file":
                emulator[currentValue.name] = currentValue.files;
                break;
              default:
                emulator[currentValue.name] = currentValue.value;
            }
            // gán giá trị cho toán tử và trả về giá trị toán tử

            return emulator;
          },
          {}
        );
        _this.onSubmit(accountRegister);
      }
    };
  }
}
