!(function () {
    "use strict";
    var e = Object.defineProperty,
        t = Object.getOwnPropertySymbols,
        s = Object.prototype.hasOwnProperty,
        r = Object.prototype.propertyIsEnumerable,
        i = (t, s, r) =>
            s in t
                ? e(t, s, {
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                      value: r,
                  })
                : (t[s] = r),
        l = (e, l) => {
            for (var o in l || (l = {})) s.call(l, o) && i(e, o, l[o]);
            if (t) for (var o of t(l)) r.call(l, o) && i(e, o, l[o]);
            return e;
        },
        o = (e, t, s) => (i(e, "symbol" != typeof t ? t + "" : t, s), s);
    const a =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        n = /^[0-9]+$/,
        d = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        c =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var u = ((e) => (
            (e.Required = "required"),
            (e.Email = "email"),
            (e.MinLength = "minLength"),
            (e.MaxLength = "maxLength"),
            (e.Password = "password"),
            (e.Number = "number"),
            (e.MaxNumber = "maxNumber"),
            (e.MinNumber = "minNumber"),
            (e.StrongPassword = "strongPassword"),
            (e.CustomRegexp = "customRegexp"),
            (e.MinFilesCount = "minFilesCount"),
            (e.MaxFilesCount = "maxFilesCount"),
            (e.Files = "files"),
            e
        ))(u || {}),
        h = ((e) => ((e.Required = "required"), e))(h || {}),
        f = ((e) => ((e.Label = "label"), (e.LabelArrow = "labelArrow"), e))(
            f || {}
        );
    const m = (e) => !!e && "function" == typeof e.then,
        g = (e) =>
            Array.isArray(e)
                ? e.filter((e) => e.length > 0)
                : "string" == typeof e && e.trim()
                ? [...e.split(" ").filter((e) => e.length > 0)]
                : [],
        b = {
            errorFieldStyle: { color: "#b81111", border: "1px solid #B81111" },
            errorFieldCssClass: "just-validate-error-field",
            successFieldCssClass: "just-validate-success-field",
            errorLabelStyle: { color: "#b81111" },
            errorLabelCssClass: "just-validate-error-label",
            successLabelCssClass: "just-validate-success-label",
            focusInvalidField: !0,
            lockForm: !0,
            testingMode: !1,
        };
    class v {
        constructor(e, t, s) {
            o(this, "form", null),
                o(this, "fields", {}),
                o(this, "groupFields", {}),
                o(this, "errors", {}),
                o(this, "isValid", !1),
                o(this, "isSubmitted", !1),
                o(this, "globalConfig", b),
                o(this, "errorLabels", {}),
                o(this, "successLabels", {}),
                o(this, "eventListeners", []),
                o(this, "dictLocale", []),
                o(this, "currentLocale"),
                o(this, "customStyleTags", {}),
                o(this, "onSuccessCallback"),
                o(this, "onFailCallback"),
                o(this, "tooltips", []),
                o(this, "lastScrollPosition"),
                o(this, "isScrollTick"),
                o(this, "refreshAllTooltips", () => {
                    this.tooltips.forEach((e) => {
                        e.refresh();
                    });
                }),
                o(this, "handleDocumentScroll", () => {
                    (this.lastScrollPosition = window.scrollY),
                        this.isScrollTick ||
                            (window.requestAnimationFrame(() => {
                                this.refreshAllTooltips(),
                                    (this.isScrollTick = !1);
                            }),
                            (this.isScrollTick = !0));
                }),
                o(this, "formSubmitHandler", (e) => {
                    e.preventDefault(),
                        (this.isSubmitted = !0),
                        this.validateHandler(e);
                }),
                o(this, "handleFieldChange", (e) => {
                    let t;
                    for (const s in this.fields) {
                        if (this.fields[s].elem === e) {
                            t = s;
                            break;
                        }
                    }
                    t && this.validateField(t, !0);
                }),
                o(this, "handleGroupChange", (e) => {
                    let t, s;
                    for (const r in this.groupFields) {
                        const i = this.groupFields[r];
                        if (i.elems.find((t) => t === e)) {
                            (t = i), (s = r);
                            break;
                        }
                    }
                    t && s && this.validateGroup(s, t);
                }),
                o(this, "handlerChange", (e) => {
                    e.target &&
                        (this.handleFieldChange(e.target),
                        this.handleGroupChange(e.target),
                        this.renderErrors());
                }),
                this.initialize(e, t, s);
        }
        initialize(e, t, s) {
            if (
                ((this.form = null),
                (this.errors = {}),
                (this.isValid = !1),
                (this.isSubmitted = !1),
                (this.globalConfig = b),
                (this.errorLabels = {}),
                (this.successLabels = {}),
                (this.eventListeners = []),
                (this.customStyleTags = {}),
                (this.tooltips = []),
                "string" == typeof e)
            ) {
                const t = document.querySelector(e);
                if (!t)
                    throw Error(
                        `Form with ${e} selector not found! Please check the form selector`
                    );
                this.setForm(t);
            } else {
                if (!(e instanceof HTMLFormElement))
                    throw Error(
                        "Form selector is not valid. Please specify a string selector or a DOM element."
                    );
                this.setForm(e);
            }
            if (
                ((this.globalConfig = l(l({}, b), t)),
                s && (this.dictLocale = s),
                this.isTooltip())
            ) {
                const e = document.createElement("style");
                (e.textContent =
                    ".just-validate-error-label[data-tooltip=true]{position:fixed;padding:4px 8px;background:#423f3f;color:#fff;white-space:nowrap;z-index:10;border-radius:4px;transform:translateY(-5px)}.just-validate-error-label[data-tooltip=true]:before{content:'';width:0;height:0;border-left:solid 5px transparent;border-right:solid 5px transparent;border-bottom:solid 5px #423f3f;position:absolute;z-index:3;display:block;bottom:-5px;transform:rotate(180deg);left:calc(50% - 5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]{transform:translateX(-5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]:before{right:-7px;bottom:auto;left:auto;top:calc(50% - 2px);transform:rotate(90deg)}.just-validate-error-label[data-tooltip=true][data-direction=right]{transform:translateX(5px)}.just-validate-error-label[data-tooltip=true][data-direction=right]:before{right:auto;bottom:auto;left:-7px;top:calc(50% - 2px);transform:rotate(-90deg)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]{transform:translateY(5px)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]:before{right:auto;bottom:auto;left:calc(50% - 5px);top:-5px;transform:rotate(0)}"),
                    (this.customStyleTags[f.Label] =
                        document.head.appendChild(e)),
                    this.addListener(
                        "scroll",
                        document,
                        this.handleDocumentScroll
                    );
            }
        }
        getLocalisedString(e) {
            var t;
            if (!this.currentLocale || !this.dictLocale.length) return e;
            return (
                (null == (t = this.dictLocale.find((t) => t.key === e))
                    ? void 0
                    : t.dict[this.currentLocale]) || e
            );
        }
        getFieldErrorMessage(e, t) {
            const s =
                "function" == typeof e.errorMessage
                    ? e.errorMessage(this.getElemValue(t), this.fields)
                    : e.errorMessage;
            return (
                this.getLocalisedString(s) ||
                ((e, t) => {
                    switch (e) {
                        case u.Required:
                            return "The field is required";
                        case u.Email:
                            return "Email has invalid format";
                        case u.MaxLength:
                            return "The field must contain a maximum of :value characters".replace(
                                ":value",
                                String(t)
                            );
                        case u.MinLength:
                            return "The field must contain a minimum of :value characters".replace(
                                ":value",
                                String(t)
                            );
                        case u.Password:
                            return "Password must contain minimum eight characters, at least one letter and one number";
                        case u.Number:
                            return "Value should be a number";
                        case u.StrongPassword:
                            return "Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
                        case u.MaxNumber:
                            return "Number should be less or equal than :value".replace(
                                ":value",
                                String(t)
                            );
                        case u.MinNumber:
                            return "Number should be more or equal than :value".replace(
                                ":value",
                                String(t)
                            );
                        case u.MinFilesCount:
                            return "Files count should be more or equal than :value".replace(
                                ":value",
                                String(t)
                            );
                        case u.MaxFilesCount:
                            return "Files count should be less or equal than :value".replace(
                                ":value",
                                String(t)
                            );
                        case u.Files:
                            return "Uploaded files have one or several invalid properties (extension/size/type etc)";
                        default:
                            return "Value is incorrect";
                    }
                })(e.rule, e.value)
            );
        }
        getFieldSuccessMessage(e, t) {
            const s =
                "function" == typeof e
                    ? e(this.getElemValue(t), this.fields)
                    : e;
            return this.getLocalisedString(s);
        }
        getGroupErrorMessage(e) {
            return (
                this.getLocalisedString(e.errorMessage) ||
                (e.rule === h.Required
                    ? "The field is required"
                    : "Group is incorrect")
            );
        }
        getGroupSuccessMessage(e) {
            return this.getLocalisedString(e.successMessage);
        }
        setFieldInvalid(e, t) {
            (this.fields[e].isValid = !1),
                (this.fields[e].errorMessage = this.getFieldErrorMessage(
                    t,
                    this.fields[e].elem
                ));
        }
        setFieldValid(e, t) {
            (this.fields[e].isValid = !0),
                void 0 !== t &&
                    (this.fields[e].successMessage =
                        this.getFieldSuccessMessage(t, this.fields[e].elem));
        }
        setGroupInvalid(e, t) {
            (this.groupFields[e].isValid = !1),
                (this.groupFields[e].errorMessage =
                    this.getGroupErrorMessage(t));
        }
        setGroupValid(e, t) {
            (this.groupFields[e].isValid = !0),
                (this.groupFields[e].successMessage =
                    this.getGroupSuccessMessage(t));
        }
        getElemValue(e) {
            switch (e.type) {
                case "checkbox":
                    return e.checked;
                case "file":
                    return e.files;
                default:
                    return e.value;
            }
        }
        validateGroupRule(e, t, s) {
            if (s.rule === h.Required)
                t.every((e) => !e.checked)
                    ? this.setGroupInvalid(e, s)
                    : this.setGroupValid(e, s);
        }
        validateFieldRule(e, t, s, r = !1) {
            const i = s.value,
                l = this.getElemValue(t);
            if (s.plugin) {
                s.plugin(l, this.fields) || this.setFieldInvalid(e, s);
            } else {
                switch (s.rule) {
                    case u.Required:
                        ((e) => {
                            let t = e;
                            return "string" == typeof e && (t = e.trim()), !t;
                        })(l) && this.setFieldInvalid(e, s);
                        break;
                    case u.Email:
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        (o = l), a.test(o) || this.setFieldInvalid(e, s);
                        break;
                    case u.MaxLength:
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        ((e, t) => e.length > t)(l, i) &&
                            this.setFieldInvalid(e, s);
                        break;
                    case u.MinLength:
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        ((e, t) => e.length < t)(l, i) &&
                            this.setFieldInvalid(e, s);
                        break;
                    case u.Password:
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        ((e) => d.test(e))(l) || this.setFieldInvalid(e, s);
                        break;
                    case u.StrongPassword:
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        ((e) => c.test(e))(l) || this.setFieldInvalid(e, s);
                        break;
                    case u.Number:
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        ((e) => n.test(e))(l) || this.setFieldInvalid(e, s);
                        break;
                    case u.MaxNumber: {
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        const t = +l;
                        (Number.isNaN(t) || ((e, t) => e > t)(t, i)) &&
                            this.setFieldInvalid(e, s);
                        break;
                    }
                    case u.MinNumber: {
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("string" != typeof l) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("" === l) break;
                        const t = +l;
                        (Number.isNaN(t) || ((e, t) => e < t)(t, i)) &&
                            this.setFieldInvalid(e, s);
                        break;
                    }
                    case u.CustomRegexp: {
                        if (void 0 === i)
                            return (
                                console.error(
                                    `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
                                ),
                                void this.setFieldInvalid(e, s)
                            );
                        let t;
                        try {
                            t = new RegExp(i);
                        } catch (t) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] should be a valid regexp. This field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        const r = String(l);
                        "" === r || t.test(r) || this.setFieldInvalid(e, s);
                        break;
                    }
                    case u.MinFilesCount:
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if (
                            Number.isFinite(null == l ? void 0 : l.length) &&
                            l.length < i
                        ) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        break;
                    case u.MaxFilesCount:
                        if (void 0 === i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if ("number" != typeof i) {
                            console.error(
                                `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
                            ),
                                this.setFieldInvalid(e, s);
                            break;
                        }
                        if (
                            Number.isFinite(null == l ? void 0 : l.length) &&
                            l.length > i
                        ) {
                            this.setFieldInvalid(e, s);
                            break;
                        }
                        break;
                    case u.Files: {
                        if (void 0 === i)
                            return (
                                console.error(
                                    `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
                                ),
                                void this.setFieldInvalid(e, s)
                            );
                        if ("object" != typeof i)
                            return (
                                console.error(
                                    `Value for ${s.rule} rule for [${e}] field should be an object. This field will be always invalid.`
                                ),
                                void this.setFieldInvalid(e, s)
                            );
                        const t = i.files;
                        if ("object" != typeof t)
                            return (
                                console.error(
                                    `Value for ${s.rule} rule for [${e}] field should be an object with files array. This field will be always invalid.`
                                ),
                                void this.setFieldInvalid(e, s)
                            );
                        const r = (e, t) => {
                            const s =
                                    Number.isFinite(t.minSize) &&
                                    e.size < t.minSize,
                                r =
                                    Number.isFinite(t.maxSize) &&
                                    e.size > t.maxSize,
                                i =
                                    Array.isArray(t.names) &&
                                    !t.names.includes(e.name),
                                l =
                                    Array.isArray(t.extensions) &&
                                    !t.extensions.includes(
                                        e.name.split(".")[
                                            e.name.split(".").length - 1
                                        ]
                                    ),
                                o =
                                    Array.isArray(t.types) &&
                                    !t.types.includes(e.type);
                            return s || r || i || l || o;
                        };
                        if ("object" == typeof l && null !== l)
                            for (let i = 0, o = l.length; i < o; ++i) {
                                const o = l.item(i);
                                if (!o) {
                                    this.setFieldInvalid(e, s);
                                    break;
                                }
                                if (r(o, t)) {
                                    this.setFieldInvalid(e, s);
                                    break;
                                }
                            }
                        break;
                    }
                    default: {
                        if ("function" != typeof s.validator)
                            return (
                                console.error(
                                    `Validator for custom rule for [${e}] field should be a function. This field will be always invalid.`
                                ),
                                void this.setFieldInvalid(e, s)
                            );
                        const t = s.validator(l, this.fields);
                        if (
                            ("boolean" != typeof t &&
                                "function" != typeof t &&
                                console.error(
                                    `Validator return value for [${e}] field should be boolean or function. It will be cast to boolean.`
                                ),
                            "function" == typeof t)
                        ) {
                            if (!r) {
                                this.fields[e].asyncCheckPending = !1;
                                const r = t();
                                return m(r)
                                    ? r
                                          .then((t) => {
                                              t || this.setFieldInvalid(e, s);
                                          })
                                          .catch(() => {
                                              this.setFieldInvalid(e, s);
                                          })
                                    : (console.error(
                                          `Validator function for custom rule for [${e}] field should return a Promise. This field will be always invalid.`
                                      ),
                                      void this.setFieldInvalid(e, s));
                            }
                            this.fields[e].asyncCheckPending = !0;
                        }
                        t || this.setFieldInvalid(e, s);
                    }
                }
                var o;
            }
        }
        validateField(e, t = !1) {
            var s;
            const r = this.fields[e];
            r.isValid = !0;
            const i = [];
            return (
                [...r.rules].reverse().forEach((s) => {
                    const l = this.validateFieldRule(e, r.elem, s, t);
                    m(l) && i.push(l);
                }),
                r.isValid &&
                    this.setFieldValid(
                        e,
                        null == (s = r.config) ? void 0 : s.successMessage
                    ),
                Promise.allSettled(i)
            );
        }
        revalidateField(e) {
            if ("string" != typeof e)
                throw Error(
                    "Field selector is not valid. Please specify a string selector."
                );
            return this.fields[e]
                ? new Promise((t) => {
                      this.validateField(e, !0).finally(() => {
                          this.clearFieldStyle(e),
                              this.clearFieldLabel(e),
                              this.renderFieldError(e),
                              t(!!this.fields[e].isValid);
                      });
                  })
                : (console.error("Field not found. Check the field selector."),
                  Promise.reject());
        }
        validateGroup(e, t) {
            const s = [];
            return (
                [...t.rules].reverse().forEach((r) => {
                    const i = this.validateGroupRule(e, t.elems, r);
                    m(i) && s.push(i);
                }),
                Promise.allSettled(s)
            );
        }
        focusInvalidField() {
            for (const e in this.fields) {
                const t = this.fields[e];
                if (!t.isValid) {
                    setTimeout(() => t.elem.focus(), 0);
                    break;
                }
            }
        }
        afterSubmitValidation(e = !1) {
            this.renderErrors(e),
                this.globalConfig.focusInvalidField && this.focusInvalidField();
        }
        validate(e = !1) {
            return new Promise((t) => {
                const s = [];
                Object.keys(this.fields).forEach((e) => {
                    const t = this.validateField(e);
                    m(t) && s.push(t);
                }),
                    Object.keys(this.groupFields).forEach((e) => {
                        const t = this.groupFields[e],
                            r = this.validateGroup(e, t);
                        m(r) && s.push(r);
                    }),
                    s.length
                        ? Promise.allSettled(s).then(() => {
                              this.afterSubmitValidation(e), t(!0);
                          })
                        : (this.afterSubmitValidation(e), t(!1));
            });
        }
        revalidate() {
            return new Promise((e) => {
                this.validateHandler(void 0, !0).finally(() => {
                    this.globalConfig.focusInvalidField &&
                        this.focusInvalidField(),
                        e(this.isValid);
                });
            });
        }
        validateHandler(e, t = !1) {
            return (
                this.globalConfig.lockForm && this.lockForm(),
                this.validate(t).finally(() => {
                    var t, s;
                    this.globalConfig.lockForm && this.unlockForm(),
                        this.isValid
                            ? null == (t = this.onSuccessCallback) ||
                              t.call(this, e)
                            : null == (s = this.onFailCallback) ||
                              s.call(this, this.fields, this.groupFields);
                })
            );
        }
        setForm(e) {
            (this.form = e),
                this.form.setAttribute("novalidate", "novalidate"),
                this.removeListener(
                    "submit",
                    this.form,
                    this.formSubmitHandler
                ),
                this.addListener("submit", this.form, this.formSubmitHandler);
        }
        addListener(e, t, s) {
            t.addEventListener(e, s),
                this.eventListeners.push({ type: e, elem: t, func: s });
        }
        removeListener(e, t, s) {
            t.removeEventListener(e, s),
                (this.eventListeners = this.eventListeners.filter(
                    (s) => s.type !== e || s.elem !== t
                ));
        }
        addField(e, t, s) {
            if ("string" != typeof e)
                throw Error(
                    "Field selector is not valid. Please specify a string selector."
                );
            const r = this.form.querySelector(e);
            if (!r)
                throw Error(
                    `Field with ${e} selector not found! Please check the field selector.`
                );
            if (!Array.isArray(t) || !t.length)
                throw Error(
                    `Rules argument for the field [${e}] should be an array and should contain at least 1 element.`
                );
            return (
                t.forEach((t) => {
                    if (!("rule" in t || "validator" in t || "plugin" in t))
                        throw Error(
                            `Rules argument for the field [${e}] must contain at least one rule or validator property.`
                        );
                    if (
                        !(
                            t.validator ||
                            t.plugin ||
                            (t.rule && Object.values(u).includes(t.rule))
                        )
                    )
                        throw Error(
                            `Rule should be one of these types: ${Object.values(
                                u
                            ).join(", ")}. Provided value: ${t.rule}`
                        );
                }),
                (this.fields[e] = {
                    elem: r,
                    rules: t,
                    isValid: void 0,
                    config: s,
                }),
                this.setListeners(r),
                this.isSubmitted && this.validate(),
                this
            );
        }
        removeField(e) {
            if ("string" != typeof e)
                throw Error(
                    "Field selector is not valid. Please specify a string selector."
                );
            if (!this.fields[e])
                return (
                    console.error("Field not found. Check the field selector."),
                    this
                );
            const t = this.getListenerType(this.fields[e].elem.type);
            return (
                this.removeListener(t, this.fields[e].elem, this.handlerChange),
                this.clearErrors(),
                delete this.fields[e],
                this
            );
        }
        removeGroup(e) {
            if ("string" != typeof e)
                throw Error(
                    "Group selector is not valid. Please specify a string selector."
                );
            return this.groupFields[e]
                ? (this.groupFields[e].elems.forEach((e) => {
                      const t = this.getListenerType(e.type);
                      this.removeListener(t, e, this.handlerChange);
                  }),
                  this.clearErrors(),
                  delete this.groupFields[e],
                  this)
                : (console.error("Group not found. Check the group selector."),
                  this);
        }
        addRequiredGroup(e, t, s, r) {
            if ("string" != typeof e)
                throw Error(
                    "Group selector is not valid. Please specify a string selector."
                );
            const i = this.form.querySelector(e);
            if (!i)
                throw Error(
                    `Group with ${e} selector not found! Please check the group selector.`
                );
            const l = i.querySelectorAll("input"),
                o = Array.from(l).filter((e) => {
                    const t = ((e, t) => {
                        const s = [...t].reverse();
                        for (let t = 0, r = s.length; t < r; ++t) {
                            const r = s[t];
                            for (const t in e) {
                                const s = e[t];
                                if (s.groupElem === r) return [t, s];
                            }
                        }
                        return null;
                    })(
                        this.groupFields,
                        ((e) => {
                            let t = e;
                            const s = [];
                            for (; t; ) s.unshift(t), (t = t.parentNode);
                            return s;
                        })(e)
                    );
                    return !t || t[1].elems.find((t) => t !== e);
                });
            return (
                (this.groupFields[e] = {
                    rules: [
                        {
                            rule: h.Required,
                            errorMessage: t,
                            successMessage: r,
                        },
                    ],
                    groupElem: i,
                    elems: o,
                    isDirty: !1,
                    isValid: void 0,
                    config: s,
                }),
                l.forEach((e) => {
                    this.setListeners(e);
                }),
                this
            );
        }
        getListenerType(e) {
            switch (e) {
                case "checkbox":
                case "select-one":
                case "file":
                case "radio":
                    return "change";
                default:
                    return "input";
            }
        }
        setListeners(e) {
            const t = this.getListenerType(e.type);
            this.removeListener(t, e, this.handlerChange),
                this.addListener(t, e, this.handlerChange);
        }
        clearFieldLabel(e) {
            var t, s;
            null == (t = this.errorLabels[e]) || t.remove(),
                null == (s = this.successLabels[e]) || s.remove();
        }
        clearFieldStyle(e) {
            var t, s, r, i;
            const l = this.fields[e],
                o =
                    (null == (t = l.config) ? void 0 : t.errorFieldStyle) ||
                    this.globalConfig.errorFieldStyle;
            Object.keys(o).forEach((e) => {
                l.elem.style[e] = "";
            });
            const a =
                (null == (s = l.config) ? void 0 : s.successFieldStyle) ||
                this.globalConfig.successFieldStyle ||
                {};
            Object.keys(a).forEach((e) => {
                l.elem.style[e] = "";
            }),
                l.elem.classList.remove(
                    ...g(
                        (null == (r = l.config)
                            ? void 0
                            : r.errorFieldCssClass) ||
                            this.globalConfig.errorFieldCssClass
                    ),
                    ...g(
                        (null == (i = l.config)
                            ? void 0
                            : i.successFieldCssClass) ||
                            this.globalConfig.successFieldCssClass
                    )
                );
        }
        clearErrors() {
            var e, t;
            Object.keys(this.errorLabels).forEach((e) =>
                this.errorLabels[e].remove()
            ),
                Object.keys(this.successLabels).forEach((e) =>
                    this.successLabels[e].remove()
                );
            for (const e in this.fields) this.clearFieldStyle(e);
            for (const s in this.groupFields) {
                const r = this.groupFields[s],
                    i =
                        (null == (e = r.config) ? void 0 : e.errorFieldStyle) ||
                        this.globalConfig.errorFieldStyle;
                Object.keys(i).forEach((e) => {
                    r.elems.forEach((t) => {
                        var s;
                        (t.style[e] = ""),
                            t.classList.remove(
                                ...g(
                                    (null == (s = r.config)
                                        ? void 0
                                        : s.errorFieldCssClass) ||
                                        this.globalConfig.errorFieldCssClass
                                )
                            );
                    });
                });
                const l =
                    (null == (t = r.config) ? void 0 : t.successFieldStyle) ||
                    this.globalConfig.successFieldStyle ||
                    {};
                Object.keys(l).forEach((e) => {
                    r.elems.forEach((t) => {
                        var s;
                        (t.style[e] = ""),
                            t.classList.remove(
                                ...g(
                                    (null == (s = r.config)
                                        ? void 0
                                        : s.successFieldCssClass) ||
                                        this.globalConfig.successFieldCssClass
                                )
                            );
                    });
                });
            }
            this.tooltips = [];
        }
        isTooltip() {
            return !!this.globalConfig.tooltip;
        }
        lockForm() {
            const e = this.form.querySelectorAll(
                "input, textarea, button, select"
            );
            for (let t = 0, s = e.length; t < s; ++t)
                e[t].setAttribute(
                    "data-just-validate-fallback-disabled",
                    e[t].disabled ? "true" : "false"
                ),
                    e[t].setAttribute("disabled", "disabled"),
                    (e[t].style.pointerEvents = "none"),
                    (e[t].style.webkitFilter = "grayscale(100%)"),
                    (e[t].style.filter = "grayscale(100%)");
        }
        unlockForm() {
            const e = this.form.querySelectorAll(
                "input, textarea, button, select"
            );
            for (let t = 0, s = e.length; t < s; ++t)
                "true" !==
                    e[t].getAttribute("data-just-validate-fallback-disabled") &&
                    e[t].removeAttribute("disabled"),
                    (e[t].style.pointerEvents = ""),
                    (e[t].style.webkitFilter = ""),
                    (e[t].style.filter = "");
        }
        renderTooltip(e, t, s) {
            var r;
            const {
                    top: i,
                    left: l,
                    width: o,
                    height: a,
                } = e.getBoundingClientRect(),
                n = t.getBoundingClientRect(),
                d =
                    s ||
                    (null == (r = this.globalConfig.tooltip)
                        ? void 0
                        : r.position);
            switch (d) {
                case "left":
                    (t.style.top = i + a / 2 - n.height / 2 + "px"),
                        (t.style.left = l - n.width - 5 + "px");
                    break;
                case "top":
                    (t.style.top = i - n.height - 5 + "px"),
                        (t.style.left = l + o / 2 - n.width / 2 + "px");
                    break;
                case "right":
                    (t.style.top = i + a / 2 - n.height / 2 + "px"),
                        (t.style.left = `${l + o + 5}px`);
                    break;
                case "bottom":
                    (t.style.top = `${i + a + 5}px`),
                        (t.style.left = l + o / 2 - n.width / 2 + "px");
            }
            t.dataset.direction = d;
            return {
                refresh: () => {
                    this.renderTooltip(e, t, s);
                },
            };
        }
        createErrorLabelElem(e, t, s) {
            const r = document.createElement("div");
            r.innerHTML = t;
            const i = this.isTooltip()
                ? null == s
                    ? void 0
                    : s.errorLabelStyle
                : (null == s ? void 0 : s.errorLabelStyle) ||
                  this.globalConfig.errorLabelStyle;
            return (
                Object.assign(r.style, i),
                r.classList.add(
                    ...g(
                        (null == s ? void 0 : s.errorLabelCssClass) ||
                            this.globalConfig.errorLabelCssClass
                    ),
                    "just-validate-error-label"
                ),
                this.isTooltip() && (r.dataset.tooltip = "true"),
                this.globalConfig.testingMode &&
                    (r.dataset.testId = `error-label-${e}`),
                (this.errorLabels[e] = r),
                r
            );
        }
        createSuccessLabelElem(e, t, s) {
            if (void 0 === t) return null;
            const r = document.createElement("div");
            r.innerHTML = t;
            const i =
                (null == s ? void 0 : s.successLabelStyle) ||
                this.globalConfig.successLabelStyle;
            return (
                Object.assign(r.style, i),
                r.classList.add(
                    ...g(
                        (null == s ? void 0 : s.successLabelCssClass) ||
                            this.globalConfig.successLabelCssClass
                    ),
                    "just-validate-success-label"
                ),
                this.globalConfig.testingMode &&
                    (r.dataset.testId = `success-label-${e}`),
                (this.successLabels[e] = r),
                r
            );
        }
        renderErrorsContainer(e, t) {
            const s = t || this.globalConfig.errorsContainer;
            if ("string" == typeof s) {
                const t = this.form.querySelector(s);
                if (t) return t.appendChild(e), !0;
                console.error(
                    `Error container with ${s} selector not found. Errors will be rendered as usual`
                );
            }
            return s instanceof Element
                ? (s.appendChild(e), !0)
                : (void 0 !== s &&
                      console.error(
                          "Error container not found. It should be a string or existing Element. Errors will be rendered as usual"
                      ),
                  !1);
        }
        renderGroupLabel(e, t, s, r) {
            if (!r) {
                if (this.renderErrorsContainer(t, s)) return;
            }
            e.appendChild(t);
        }
        renderFieldLabel(e, t, s, r) {
            var i, l, o, a, n, d, c;
            if (!r) {
                if (this.renderErrorsContainer(t, s)) return;
            }
            if ("checkbox" === e.type || "radio" === e.type) {
                const s = document.querySelector(
                    `label[for="${e.getAttribute("id")}"]`
                );
                "label" ===
                (null ==
                (l = null == (i = e.parentElement) ? void 0 : i.tagName)
                    ? void 0
                    : l.toLowerCase())
                    ? null ==
                          (a =
                              null == (o = e.parentElement)
                                  ? void 0
                                  : o.parentElement) || a.appendChild(t)
                    : s
                    ? null == (n = s.parentElement) || n.appendChild(t)
                    : null == (d = e.parentElement) || d.appendChild(t);
            } else null == (c = e.parentElement) || c.appendChild(t);
        }
        showLabels(e, t) {
            Object.keys(e).forEach((s, r) => {
                const i = e[s],
                    l = this.fields[s];
                (l.isValid = !t),
                    this.clearFieldStyle(s),
                    this.clearFieldLabel(s),
                    this.renderFieldError(s, i),
                    0 === r &&
                        this.globalConfig.focusInvalidField &&
                        setTimeout(() => l.elem.focus(), 0);
            });
        }
        showErrors(e) {
            if ("object" != typeof e)
                throw Error(
                    "[showErrors]: Errors should be an object with key: value format"
                );
            this.showLabels(e, !0);
        }
        showSuccessLabels(e) {
            if ("object" != typeof e)
                throw Error(
                    "[showSuccessLabels]: Labels should be an object with key: value format"
                );
            this.showLabels(e, !1);
        }
        renderFieldError(e, t) {
            var s, r, i, l, o, a;
            const n = this.fields[e];
            if (n.isValid) {
                if (!n.asyncCheckPending) {
                    const i = this.createSuccessLabelElem(
                        e,
                        void 0 !== t ? t : n.successMessage,
                        n.config
                    );
                    i &&
                        this.renderFieldLabel(
                            n.elem,
                            i,
                            null == (s = n.config) ? void 0 : s.errorsContainer,
                            !0
                        ),
                        n.elem.classList.add(
                            ...g(
                                (null == (r = n.config)
                                    ? void 0
                                    : r.successFieldCssClass) ||
                                    this.globalConfig.successFieldCssClass
                            )
                        );
                }
                return;
            }
            (this.isValid = !1),
                n.elem.classList.add(
                    ...g(
                        (null == (i = n.config)
                            ? void 0
                            : i.errorFieldCssClass) ||
                            this.globalConfig.errorFieldCssClass
                    )
                );
            const d = this.createErrorLabelElem(
                e,
                void 0 !== t ? t : n.errorMessage,
                n.config
            );
            this.renderFieldLabel(
                n.elem,
                d,
                null == (l = n.config) ? void 0 : l.errorsContainer
            ),
                this.isTooltip() &&
                    this.tooltips.push(
                        this.renderTooltip(
                            n.elem,
                            d,
                            null ==
                                (a =
                                    null == (o = n.config) ? void 0 : o.tooltip)
                                ? void 0
                                : a.position
                        )
                    );
        }
        renderErrors(e = !1) {
            var t, s, r, i;
            if (this.isSubmitted || e) {
                this.clearErrors(), (this.isValid = !0);
                for (const e in this.groupFields) {
                    const l = this.groupFields[e];
                    if (l.isValid) {
                        l.elems.forEach((e) => {
                            var t, s;
                            Object.assign(
                                e.style,
                                (null == (t = l.config)
                                    ? void 0
                                    : t.successFieldStyle) ||
                                    this.globalConfig.successFieldStyle
                            ),
                                e.classList.add(
                                    ...g(
                                        (null == (s = l.config)
                                            ? void 0
                                            : s.successFieldCssClass) ||
                                            this.globalConfig
                                                .successFieldCssClass
                                    )
                                );
                        });
                        const s = this.createSuccessLabelElem(
                            e,
                            l.successMessage,
                            l.config
                        );
                        s &&
                            this.renderGroupLabel(
                                l.groupElem,
                                s,
                                null == (t = l.config)
                                    ? void 0
                                    : t.errorsContainer,
                                !0
                            );
                        continue;
                    }
                    (this.isValid = !1),
                        l.elems.forEach((e) => {
                            var t, s;
                            Object.assign(
                                e.style,
                                (null == (t = l.config)
                                    ? void 0
                                    : t.errorFieldStyle) ||
                                    this.globalConfig.errorFieldStyle
                            ),
                                e.classList.add(
                                    ...g(
                                        (null == (s = l.config)
                                            ? void 0
                                            : s.errorFieldCssClass) ||
                                            this.globalConfig.errorFieldCssClass
                                    )
                                );
                        });
                    const o = this.createErrorLabelElem(
                        e,
                        l.errorMessage,
                        l.config
                    );
                    this.renderGroupLabel(
                        l.groupElem,
                        o,
                        null == (s = l.config) ? void 0 : s.errorsContainer
                    ),
                        this.isTooltip() &&
                            this.tooltips.push(
                                this.renderTooltip(
                                    l.groupElem,
                                    o,
                                    null ==
                                        (i =
                                            null == (r = l.config)
                                                ? void 0
                                                : r.tooltip)
                                        ? void 0
                                        : i.position
                                )
                            );
                }
                for (const e in this.fields) this.renderFieldError(e);
            }
        }
        destroy() {
            this.eventListeners.forEach((e) => {
                this.removeListener(e.type, e.elem, e.func);
            }),
                Object.keys(this.customStyleTags).forEach((e) => {
                    this.customStyleTags[e].remove();
                }),
                this.clearErrors(),
                this.globalConfig.lockForm && this.unlockForm();
        }
        refresh() {
            this.destroy(),
                this.form
                    ? (this.initialize(this.form, this.globalConfig),
                      Object.keys(this.fields).forEach((e) => {
                          this.addField(
                              e,
                              [...this.fields[e].rules],
                              this.fields[e].config
                          );
                      }))
                    : console.error(
                          "Cannot initialize the library! Form is not defined"
                      );
        }
        setCurrentLocale(e) {
            "string" == typeof e || void 0 === e
                ? ((this.currentLocale = e),
                  this.isSubmitted && this.validate())
                : console.error("Current locale should be a string");
        }
        onSuccess(e) {
            return (this.onSuccessCallback = e), this;
        }
        onFail(e) {
            return (this.onFailCallback = e), this;
        }
    }
    document.getElementById("expYearNewCard");
    const p = document.getElementById("expYearNewCard"),
        y = document.getElementById("submitNewCard"),
        F = document.getElementById("paymentByNewCardData"),
        C = new Date().getFullYear().toString().slice(-2);
    let L = new Date().getMonth() + 1;
    const E = document.getElementById("paymentBySavedCardBtn");
    if (F)
        var w = new v("#paymentByNewCardData", {
            validateBeforeSubmitting: !0,
        });
    const k = document.getElementById("paymentByQitaf");
    if (k) {
        var S = new v("#paymentByQitaf", { validateBeforeSubmitting: !0 });
        S.addField(
            "#txtMobileNumber",
            [
                { rule: "required", errorMessage: "الحقل مطلوب" },
                {
                    rule: "customRegexp",
                    value: "^(05[0-9]{8})$",
                    errorMessage: "صيغة رقم الجوال غير صحيحة",
                },
            ],
            { errorsContainer: "#errors-container_qitafMob" }
        );
    }
    function I() {
        return (
            w
                .addField("#cardNumber", [
                    { rule: "required", errorMessage: "الحقل مطلوب" },
                    {
                        rule: "customRegexp",
                        value: "^(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}|3[47][0-9]{13}|65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35[0-9]{3})[0-9]{11})$",
                        errorMessage: "الرجاء إدخال رقم بطاقة صحيح",
                    },
                    {
                        validator: (e) =>
                            (function (e) {
                                const t = `${e}`
                                        .split("")
                                        .reverse()
                                        .map((e) => parseInt(e)),
                                    s = t.splice(0, 1)[0];
                                let r = t.reduce((e, t, s) => {
                                    const r = s % 2 == 0 ? 2 * t : t;
                                    return e + (r > 9 ? r - 9 : r);
                                }, 0);
                                return (r += s), r % 10 == 0;
                            })(e),
                        errorMessage: "الرجاء إدخال رقم بطاقة صحيح",
                    },
                ])
                .addField("#member", [
                    { rule: "required", errorMessage: "الحقل مطلوب" },
                    {
                        rule: "customRegexp",
                        value: /^[a-zA-Z\s]*$/,
                        errorMessage: "الرجاء إدخال اسم صحيح",
                    },
                ])
                .addField("#cvv", [
                    { rule: "required", errorMessage: "الحقل مطلوب" },
                ])
                .addField(
                    "#expMonthNewCard",
                    [
                        { rule: "required", errorMessage: "الحقل مطلوب" },
                        {
                            rule: "maxLength",
                            value: 2,
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                        {
                            rule: "minLength",
                            value: 2,
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                        {
                            validator: (e) =>
                                (function (e) {
                                    let t = document.getElementById(
                                        "errors-container_expDateYear"
                                    );
                                    return (p.value <= C && e < L) ||
                                        Number(e) > 12
                                        ? (t.classList.add("d-none"), !1)
                                        : (t.classList.remove("d-none"), !0);
                                })(e),
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                    ],
                    { errorsContainer: "#errors-container_expDateMonth" }
                )
                .addField(
                    "#expYearNewCard",
                    [
                        { rule: "required", errorMessage: "الحقل مطلوب" },
                        {
                            rule: "maxLength",
                            value: 2,
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                        {
                            rule: "minLength",
                            value: 2,
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                        {
                            rule: "maxNumber",
                            value: Number(C) + 10,
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                        {
                            rule: "minNumber",
                            value: Number(C),
                            errorMessage: "الرجاء إدخال تاريخ صحيح",
                        },
                    ],
                    { errorsContainer: "#errors-container_expDateYear" }
                )
                .onSuccess((e) => {
                    (y.disabled = !0), F.submit();
                })
                .onFail((e) => {
                    y.disabled = !1;
                }),
            w
        );
    }
    document.querySelectorAll("#parent_payment .accordion-collapse").forEach((e) => {
        e.addEventListener("shown.bs.collapse", (e) => {
            const { target: t } = e,
                s = t.closest(".accordion-item");
            F && w.refresh(), k && S.refresh();
            document.querySelectorAll(".cvv-error-msg").forEach((e) => {
                e.classList.add("d-none"), (e.textContent = "");
            }),
                s.classList.add("payment-method-wrapper");
            document.querySelectorAll(".accordion-item").forEach((e) => {
                if (e !== s && e.classList.contains("payment-method-wrapper")) {
                    e.classList.remove("payment-method-wrapper");
                    const t = e.querySelector(".accordion-collapse");
                    new bootstrap.Collapse(t).hide();
                }
            });
            const r = document.getElementById("btnGenerateOTP");
            "qitaf" == e.target.dataset.type && (r.disabled = !0);
        }),
            e.addEventListener("hide.bs.collapse", (e) => {
                const { target: t } = e;
                t.closest(".accordion-item").classList.remove(
                    "payment-method-wrapper"
                );
            });
    }),

        E?.addEventListener("click", (e) => {
            const t = document.getElementById("paymentBySavedCard"),
                s = /^\d{3}$/;
            e.preventDefault();
            document.querySelectorAll(".saved-cards-input").forEach((e) => {
                if (e.checked) {
                    const r = e
                            .closest(".saved-card-wrapper")
                            .querySelector(".savedCard-cvv"),
                        i = e
                            .closest(".saved-card-wrapper")
                            .querySelector(".cvv-error-msg");
                    "" != r.value && r.value
                        ? r.value.length < 3 || !s.test(r.value)
                            ? (i.classList.remove("d-none"),
                              (i.textContent = "الرجاء إدخال رمز أمان صحيح"))
                            : (i.classList.add("d-none"), t.submit())
                        : (i.classList.remove("d-none"),
                          (i.textContent = "لم يتم إدخال رمز أمان البطاقة"));
                }
            });
        });
    const x = document.getElementsByName("savedCard"),
        M = document.getElementsByClassName("savedCard-cvv"),
        $ = document.getElementsByClassName("saved-card-wrapper"),
        T = document.getElementById("saveCardForLater"),
        V = document.getElementById("cardAliasName");
    for (let e = 0; e < x.length; e++) {
        x[e].onclick = function () {
            for (let e = 0; e < $.length; e++)
                $[e].classList.remove("active-card"), (M[e].disabled = !0);
            $[e].classList.add("active-card"), (M[e].disabled = !1);
        };
    }
    T?.addEventListener("change", function () {
        this.checked ? V.classList.remove("d-none") : V.classList.add("d-none");
    }),
        y?.addEventListener("click", function (e) {
            I();
        });
    const j = document.getElementById("open-payment-privacy-modal-saved-card");
    j?.addEventListener("click", function (e) {
        e.preventDefault();
        new bootstrap.Modal(
            document.getElementById("payment-privacy-modal")
        ).show();
    });
    const N = document.getElementById("qitaf-payment-privacy-modal");
    N?.addEventListener("click", function (e) {
        e.preventDefault();
        new bootstrap.Modal(
            document.getElementById("payment-privacy-modal")
        ).show();
    });
    const q = document.getElementById("cartItemsWrapper"),
        A = document.getElementById("showMoreItemsWrapper"),
        B = document.getElementById("cartLength"),
        P = document.getElementById("showMoreItems"),
        G = document.getElementById("paymentCardItems"),
        O = document.getElementById("hideItems");
    if (q) {
        let e = q?.querySelectorAll("li");
        if (e.length > 2) {
            for (let t = 2; t < e.length; t++) e[t].classList.add("d-none");
            A.classList.remove("d-none"),
                (B.innerText = e.length),
                G.classList.add("pb-40px"),
                P.addEventListener("click", function (t) {
                    for (let t = 2; t < e.length; t++)
                        e[t].classList.remove("d-none");
                    this.classList.add("d-none"),
                        O.classList.remove("d-none"),
                        e[2].focus();
                }),
                O.addEventListener("click", function (t) {
                    for (let t = 2; t < e.length; t++)
                        e[t].classList.add("d-none");
                    this.classList.add("d-none"),
                        P.classList.remove("d-none"),
                        P.focus();
                });
        }
    }
})();
