//nt constructor function of Validator
function Validator(options) {
  var formElement = document.querySelector(options.form);

  function getParent(element, selector) {
    while (element.parentElement) {
      // match the parent element class with selector or not
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  var selectorRules = {};

  if (formElement) {
    // SUBMIT
    // chặn nút submit form
    formElement.onsubmit = (e) => {
      e.preventDefault();

      var isFormValid = true;
      // lặp qua từng rule và validate
      options.rules.forEach((rule) => {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      //  The condition ensures that all input has been validated
      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          // select tất cả input có field là name và không có field disable
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );

          //  trả về dữ liệu người dùng đã nhập
          const accountRegister = Array.from(enableInputs).reduce(
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
          options.onSubmit(accountRegister);
        }
      } else {
        console.log("có lỗi");
      }
    };

    // Lắng nghe events trên rule và thực hiện
    options.rules.forEach((rule) => {
      var inputElements = formElement.querySelectorAll(rule.selector);

      // check xem có test của rule đó là mảng hay không nếu có thì add vào mảng
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      }
      // nếu không thi khởi tạo mảng trong object và add vào mảng test hiện tại
      else {
        selectorRules[rule.selector] = [rule.test];
      }

      if (inputElements) {
        Array.from(inputElements).forEach((inputElement) => {
          inputElement.onblur = () => {
            validate(inputElement, rule);
          };
          inputElement.oninput = () => {
            var errorElement = getParent(
              inputElement,
              options.formGroup
            ).querySelector(options.errorSelector);
            errorElement.innerText = "";
            getParent(inputElement, options.formGroup).classList.remove(
              "invalid"
            );
          };
        });
      }
    });
  }
  function validate(inputElement, rule) {
    var errorMessage;
    var errorElement = getParent(inputElement, options.formGroup).querySelector(
      options.errorSelector
    );
    // lấy ra các rule của selector này
    var rules = selectorRules[rule.selector];

    // lặp qua từng rule và check coi có đúng không
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "checkbox":
          break;
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked").value
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
          if (errorMessage) {
            break;
          }
      }
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroup).classList.add("invalid");
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroup).classList.remove("invalid");
    }
    return !errorMessage;
  }
}

// Define rules
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Nhập lại đi má";
    },
  };
};

Validator.isEmail = function (selector, message) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return {
    selector: selector,
    test: function (value) {
      return regex.test(value) ? undefined : message || "Nhập email má ơi ";
    },
  };
};
Validator.checkPassword = function (selector, minlength, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= minlength
        ? undefined
        : message || "Nhập lại Mk đi má ơi (nhớ là trên 8 kí tự nho)";
    },
  };
};
Validator.checkPasswordConfirm = function (selector, getConfirmation, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmation()
        ? undefined
        : message || "Nhập lại Mk đi má ơi (nhớ là trên 8 kí tự nho)";
    },
  };
};
