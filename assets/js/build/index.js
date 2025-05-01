/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/App.jsx":
/*!***************************!*\
  !*** ./assets/js/App.jsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Chat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Chat */ "./assets/js/components/Chat.jsx");
/* harmony import */ var _components_SessionGate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/SessionGate */ "./assets/js/components/SessionGate.jsx");
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");
/* harmony import */ var _contexts_ToastContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contexts/ToastContext */ "./assets/js/contexts/ToastContext.jsx");






const App = () => {
  const [selectedCaseId, setSelectedCaseId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_3__.SessionProvider, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_contexts_ToastContext__WEBPACK_IMPORTED_MODULE_4__.ToastProvider, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SessionGate__WEBPACK_IMPORTED_MODULE_2__["default"], null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Chat__WEBPACK_IMPORTED_MODULE_1__["default"], {
    selectedCaseId: selectedCaseId,
    onSelectCase: setSelectedCaseId
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./assets/js/api/apiClient.js":
/*!************************************!*\
  !*** ./assets/js/api/apiClient.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiFetch: () => (/* binding */ apiFetch)
/* harmony export */ });
async function apiFetch(path, method = "GET", body = null, queryParams = {}) {
  const restUrl = window.hrscChatVars?.restUrl || "/wp-json/hrsc/v1";
  const url = new URL(`${restUrl}${path}`);

  // Append query string for GET requests
  if (method === "GET" && queryParams && typeof queryParams === "object") {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  // Determine headers
  const headers = {
    "Content-Type": "application/json"
  };

  // Include nonce only if user is logged in (WordPress handles this in wp_localize_script)
  if (window.hrscChatVars?.nonce) {
    headers["X-WP-Nonce"] = window.hrscChatVars.nonce;
  }

  // Execute the fetch
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body && method !== "GET" ? JSON.stringify(body) : null,
    credentials: "include" // important for sending auth cookies
  });
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Invalid server response.");
  }
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

/***/ }),

/***/ "./assets/js/components/Chat.jsx":
/*!***************************************!*\
  !*** ./assets/js/components/Chat.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sidebar */ "./assets/js/components/Sidebar.jsx");
/* harmony import */ var _ChatWindow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatWindow */ "./assets/js/components/ChatWindow.jsx");
/* harmony import */ var _hooks_useMessages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useMessages */ "./assets/js/hooks/useMessages.js");
/* harmony import */ var _hooks_useSupportCases__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useSupportCases */ "./assets/js/hooks/useSupportCases.js");
/* harmony import */ var _hooks_useAuthSession__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useAuthSession */ "./assets/js/hooks/useAuthSession.js");
/* harmony import */ var _styles_Chat_module_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/Chat.module.css */ "./assets/js/styles/Chat.module.css");








const getQueryParam = name => {
  return new URLSearchParams(window.location.search).get(name);
};
const Chat = ({
  selectedCaseId,
  onSelectCase
}) => {
  const [caseId, setCaseId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(selectedCaseId || null);
  const {
    session
  } = (0,_hooks_useAuthSession__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    cases
  } = (0,_hooks_useSupportCases__WEBPACK_IMPORTED_MODULE_4__["default"])(session);
  const {
    messages,
    refreshMessages,
    loading
  } = (0,_hooks_useMessages__WEBPACK_IMPORTED_MODULE_3__["default"])(caseId);

  // Detect ?case_id and ?hr_mode from query string
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const paramId = getQueryParam("case_id");
    if (paramId && /^\d+$/.test(paramId)) {
      setCaseId(parseInt(paramId, 10));
    }
  }, []);

  // Auto-select first case if not loaded from query string
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!caseId && cases.length > 0) {
      setCaseId(cases[0].id);
      onSelectCase?.(cases[0].id);
    }
  }, [caseId, cases, onSelectCase]);
  const handleSelectCase = id => {
    setCaseId(id);
    onSelectCase?.(id);
  };
  if (!session) return null;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_Chat_module_css__WEBPACK_IMPORTED_MODULE_6__["default"].container
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Sidebar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    onSelectCase: handleSelectCase,
    selectedCaseId: caseId
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ChatWindow__WEBPACK_IMPORTED_MODULE_2__["default"], {
    caseId: caseId,
    messages: messages,
    refreshMessages: refreshMessages,
    loading: loading
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Chat);

/***/ }),

/***/ "./assets/js/components/ChatWindow.jsx":
/*!*********************************************!*\
  !*** ./assets/js/components/ChatWindow.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MessageInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MessageInput */ "./assets/js/components/MessageInput.jsx");
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");
/* harmony import */ var _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/ChatWindow.module.css */ "./assets/js/styles/ChatWindow.module.css");





const ChatWindow = ({
  caseId,
  messages,
  refreshMessages,
  loading
}) => {
  const {
    session
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_2__["default"]);
  const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [firstLoadDone, setFirstLoadDone] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [statusMessage, setStatusMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const refreshAndMarkReady = async () => {
    await refreshMessages(caseId, session);
    if (!firstLoadDone) setFirstLoadDone(true);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!caseId || !session) return;
    refreshAndMarkReady();
  }, [caseId, session]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        refreshAndMarkReady();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [caseId, session]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [messages]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setStatusMessage("Chat paused (tab inactive)");
      } else if (!navigator.onLine) {
        setStatusMessage("You are offline");
      } else {
        setStatusMessage(null);
      }
    };
    const handleOnline = () => {
      if (document.visibilityState === "visible") {
        setStatusMessage(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", () => setStatusMessage("You are offline"));
    handleVisibilityChange();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleVisibilityChange);
    };
  }, []);
  if (!caseId) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].placeholder
    }, "Select a case to view messages");
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].chatContainer
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].messagesArea
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].messagesWrapper
  }, !firstLoadDone ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].loadingText
  }, "Loading conversation\u2026") : messages.length === 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].emptyText
  }, "No messages yet. Start the conversation!") : null, statusMessage && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].statusMessage
  }, statusMessage), messages.map((msg, idx) => {
    if (msg.is_system) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: idx,
        className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].systemMessage
      }, msg.content);
    }
    const bubbleClass = msg.is_hr ? _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].hrBubble : _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].userBubble;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: idx,
      className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].messageRow
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `${_styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].bubble} ${bubbleClass}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, msg.content)));
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: messagesEndRef
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].inputBar
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_ChatWindow_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].inputWrapper
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_MessageInput__WEBPACK_IMPORTED_MODULE_1__["default"], {
    caseId: caseId,
    refreshMessages: refreshMessages
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatWindow);

/***/ }),

/***/ "./assets/js/components/MessageInput.jsx":
/*!***********************************************!*\
  !*** ./assets/js/components/MessageInput.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/apiClient */ "./assets/js/api/apiClient.js");
/* harmony import */ var _styles_MessageInput_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/MessageInput.module.css */ "./assets/js/styles/MessageInput.module.css");





const MessageInput = ({
  caseId,
  refreshMessages
}) => {
  const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [sending, setSending] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    session
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__["default"]);
  const textareaRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    textareaRef.current?.focus();
  }, [caseId]);
  const handleResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await (0,_api_apiClient__WEBPACK_IMPORTED_MODULE_2__.apiFetch)(`/support-cases/${caseId}/messages`, "POST", {
        message,
        token: session.token,
        email: session.email,
        first_name: session.firstName,
        website: ""
      });
      setMessage("");
      await refreshMessages(caseId, session);
      textareaRef.current?.focus();
      handleResize();
    } catch (err) {
      alert("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleChange = e => {
    setMessage(e.target.value);
    handleResize();
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: handleSubmit,
    className: _styles_MessageInput_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].form
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_MessageInput_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].inputWrapper
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
    ref: textareaRef,
    value: message,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    placeholder: "Type your message...",
    className: _styles_MessageInput_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].textarea,
    rows: 1
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit",
    disabled: sending || !message.trim(),
    "aria-label": "Send message",
    className: _styles_MessageInput_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].sendButton
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z",
    fill: "currentColor"
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MessageInput);

/***/ }),

/***/ "./assets/js/components/SessionGate.jsx":
/*!**********************************************!*\
  !*** ./assets/js/components/SessionGate.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");
/* harmony import */ var _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/TokenUtils */ "./assets/js/utils/TokenUtils.js");
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/apiClient */ "./assets/js/api/apiClient.js");
/* harmony import */ var _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/SessionGate.module.css */ "./assets/js/styles/SessionGate.module.css");






const SessionGate = ({
  children
}) => {
  const {
    session,
    updateSession,
    ready
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__["default"]);
  const [view, setView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("mode"); // mode | enter | create
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    token: "",
    email: "",
    firstName: ""
  });
  const [anonymous, setAnonymous] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [generatedToken, setGeneratedToken] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (view === "create" && anonymous) {
      const token = (0,_utils_TokenUtils__WEBPACK_IMPORTED_MODULE_2__.generateToken)();
      setGeneratedToken(token);
      setForm(f => ({
        ...f,
        token
      }));
    }
  }, [view, anonymous]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (view === "enter") {
        if (anonymous && form.token.trim()) {
          updateSession({
            token: form.token.trim()
          });
        } else if (!anonymous && form.email && form.firstName) {
          updateSession({
            email: form.email.trim(),
            firstName: form.firstName.trim()
          });
        }
      }
      if (view === "create") {
        const res = await (0,_api_apiClient__WEBPACK_IMPORTED_MODULE_3__.apiFetch)("/support-cases", "POST", {
          token: anonymous ? generatedToken : undefined,
          email: anonymous ? "" : form.email.trim(),
          first_name: anonymous ? "" : form.firstName.trim(),
          anonymous
        });
        if (anonymous) {
          updateSession({
            token: res.token
          });
        } else {
          updateSession({
            email: form.email.trim(),
            firstName: form.firstName.trim()
          });
        }
      }
    } catch (err) {
      alert("Failed to create or authenticate session: " + err.message);
    }
  };
  if (!ready) return null;
  if (session?.token || session?.email && session?.firstName) return children;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].container
  }, view === "mode" ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].card
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].title
  }, "How would you like to start?"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].buttonGroup
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setView("enter"),
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].primaryButton
  }, "\uD83D\uDD10 Enter Existing Conversation"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setView("create"),
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].secondaryButton
  }, "\u2728 Create New Conversation"))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: handleSubmit,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].formCard
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].title
  }, "Enter Your Chat Session"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].radioGroup
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "authMode",
    checked: anonymous,
    onChange: () => setAnonymous(true)
  }), " Anonymous"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "authMode",
    checked: !anonymous,
    onChange: () => setAnonymous(false)
  }), " ", "Identified")), view === "enter" && anonymous && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Access Token"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "token",
    value: form.token,
    onChange: handleChange,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].input
  })), view === "enter" && !anonymous && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Email"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "email",
    name: "email",
    value: form.email,
    onChange: handleChange,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].input
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "First Name"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "firstName",
    value: form.firstName,
    onChange: handleChange,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].input
  }))), view === "create" && anonymous && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Your Access Token"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].tokenRow
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: generatedToken,
    readOnly: true,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].tokenField
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => (0,_utils_TokenUtils__WEBPACK_IMPORTED_MODULE_2__.copyToClipboard)(generatedToken),
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].copyButton
  }, "Copy")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].note
  }, "Save this token to access the conversation again.")), view === "create" && !anonymous && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Email"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "email",
    name: "email",
    value: form.email,
    onChange: handleChange,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].input
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "First Name"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "firstName",
    value: form.firstName,
    onChange: handleChange,
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].input
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit",
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].primaryButton
  }, view === "enter" ? "Continue" : "Start Conversation"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_SessionGate_module_css__WEBPACK_IMPORTED_MODULE_4__["default"].backLink
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => setView("mode")
  }, "\u2190 Back"))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SessionGate);

/***/ }),

/***/ "./assets/js/components/Sidebar.jsx":
/*!******************************************!*\
  !*** ./assets/js/components/Sidebar.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useSupportCases__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hooks/useSupportCases */ "./assets/js/hooks/useSupportCases.js");
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");
/* harmony import */ var _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Sidebar.module.css */ "./assets/js/styles/Sidebar.module.css");





const Sidebar = ({
  selectedCaseId,
  onSelectCase
}) => {
  const {
    session
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_2__["default"]);
  const {
    cases,
    loading,
    error
  } = (0,_hooks_useSupportCases__WEBPACK_IMPORTED_MODULE_1__["default"])(session);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("aside", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].sidebar
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].heading
  }, "Support Cases"), loading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].loading
  }, "Loading\u2026"), error && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].error
  }, error), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].caseList
  }, cases.map(c => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: c.id,
    onClick: () => onSelectCase(c.id),
    className: `${_styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].caseItem} ${c.id === selectedCaseId ? _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].active : ""}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].caseTitle
  }, c.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _styles_Sidebar_module_css__WEBPACK_IMPORTED_MODULE_3__["default"].caseStatus
  }, c.status)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sidebar);

/***/ }),

/***/ "./assets/js/contexts/SessionContext.jsx":
/*!***********************************************!*\
  !*** ./assets/js/contexts/SessionContext.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SessionProvider: () => (/* binding */ SessionProvider),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const SessionContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
const SESSION_KEY = "hrsc_session";
const SessionProvider = ({
  children
}) => {
  const [session, setSession] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    setReady(true);
  }, [session]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SessionContext.Provider, {
    value: {
      session,
      updateSession: newSession => setSession(newSession),
      ready
    }
  }, children);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SessionContext);

/***/ }),

/***/ "./assets/js/contexts/ToastContext.jsx":
/*!*********************************************!*\
  !*** ./assets/js/contexts/ToastContext.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToastContext: () => (/* binding */ ToastContext),
/* harmony export */   ToastProvider: () => (/* binding */ ToastProvider),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const ToastContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
const ToastProvider = ({
  children
}) => {
  const [toast, setToast] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToastContext.Provider, {
    value: {
      toast,
      showToast
    }
  }, children, toast && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded shadow z-50"
  }, toast));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ToastContext);

/***/ }),

/***/ "./assets/js/hooks/useAuthSession.js":
/*!*******************************************!*\
  !*** ./assets/js/hooks/useAuthSession.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/SessionContext */ "./assets/js/contexts/SessionContext.jsx");


const useAuthSession = () => {
  const {
    session,
    updateSession,
    ready
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__["default"]);
  const isAuthenticated = !!(session?.token || session?.email && session?.firstName);
  return {
    session,
    updateSession,
    ready,
    isAuthenticated
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useAuthSession);

/***/ }),

/***/ "./assets/js/hooks/useMessages.js":
/*!****************************************!*\
  !*** ./assets/js/hooks/useMessages.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/apiClient */ "./assets/js/api/apiClient.js");


const useMessages = caseId => {
  const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const refreshMessages = async (caseId, session) => {
    if (!caseId || !session) return;
    setLoading(true);
    try {
      const data = await (0,_api_apiClient__WEBPACK_IMPORTED_MODULE_1__.apiFetch)(`/support-cases/${caseId}/messages`, "GET", null, {
        token: session.token,
        email: session.email,
        first_name: session.firstName
      });
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load handled by caller

  return {
    messages,
    setMessages,
    refreshMessages,
    loading
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useMessages);

/***/ }),

/***/ "./assets/js/hooks/useSupportCases.js":
/*!********************************************!*\
  !*** ./assets/js/hooks/useSupportCases.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/apiClient */ "./assets/js/api/apiClient.js");


const useSupportCases = session => {
  const [cases, setCases] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchCases = async () => {
      if (!session) return;
      setLoading(true);
      try {
        // For HR advisors, fetch all — no query needed
        let query = {};
        if (!session.isHR) {
          // For employees, use token/email combo
          query = {
            token: session.token,
            email: session.email,
            first_name: session.firstName
          };
        }
        const data = await (0,_api_apiClient__WEBPACK_IMPORTED_MODULE_1__.apiFetch)("/support-cases", "GET", null, query);
        setCases(data);
      } catch (err) {
        console.error("Failed to load support cases:", err);
        setError("Failed to load cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [session]);
  return {
    cases,
    loading,
    error
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useSupportCases);

/***/ }),

/***/ "./assets/js/styles/Chat.module.css":
/*!******************************************!*\
  !*** ./assets/js/styles/Chat.module.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"Chat-module__container__n_3Bx"});

/***/ }),

/***/ "./assets/js/styles/ChatWindow.module.css":
/*!************************************************!*\
  !*** ./assets/js/styles/ChatWindow.module.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"chatContainer":"ChatWindow-module__chatContainer__uCAP1","messagesArea":"ChatWindow-module__messagesArea__F6C1F","messagesWrapper":"ChatWindow-module__messagesWrapper__DEOYW","loadingText":"ChatWindow-module__loadingText__j6nWC","emptyText":"ChatWindow-module__emptyText__BQpiu","statusMessage":"ChatWindow-module__statusMessage__iuXg4","systemMessage":"ChatWindow-module__systemMessage__dSfwQ","messageRow":"ChatWindow-module__messageRow__AOX45","bubble":"ChatWindow-module__bubble__UTa7U","userBubble":"ChatWindow-module__userBubble__B1c74","hrBubble":"ChatWindow-module__hrBubble__vmMRe","meta":"ChatWindow-module__meta__CFypJ","inputBar":"ChatWindow-module__inputBar__WY51T","inputWrapper":"ChatWindow-module__inputWrapper__K6VK3"});

/***/ }),

/***/ "./assets/js/styles/MessageInput.module.css":
/*!**************************************************!*\
  !*** ./assets/js/styles/MessageInput.module.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"form":"MessageInput-module__form__JwsTx","inputWrapper":"MessageInput-module__inputWrapper__f2dEV","textarea":"MessageInput-module__textarea__KuTmN","sendButton":"MessageInput-module__sendButton__rkM4Q"});

/***/ }),

/***/ "./assets/js/styles/SessionGate.module.css":
/*!*************************************************!*\
  !*** ./assets/js/styles/SessionGate.module.css ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"SessionGate-module__container__kwA8r","card":"SessionGate-module__card__rbOkx","formCard":"SessionGate-module__formCard__hHQJ1","title":"SessionGate-module__title__xUuH0","buttonGroup":"SessionGate-module__buttonGroup__brFuP","primaryButton":"SessionGate-module__primaryButton__QaDJM","secondaryButton":"SessionGate-module__secondaryButton__YHsal","radioGroup":"SessionGate-module__radioGroup__VSPiy","input":"SessionGate-module__input__Jtz3L","tokenRow":"SessionGate-module__tokenRow__FdS6b","tokenField":"SessionGate-module__tokenField__jXhej","copyButton":"SessionGate-module__copyButton__jCy26","note":"SessionGate-module__note__UmNIu","backLink":"SessionGate-module__backLink__OsoIz"});

/***/ }),

/***/ "./assets/js/styles/Sidebar.module.css":
/*!*********************************************!*\
  !*** ./assets/js/styles/Sidebar.module.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"sidebar":"Sidebar-module__sidebar__eyeRU","heading":"Sidebar-module__heading__JmCn3","loading":"Sidebar-module__loading__n_qzF","error":"Sidebar-module__error__Al9Ym","caseList":"Sidebar-module__caseList__bO43P","caseItem":"Sidebar-module__caseItem__VmHJT","active":"Sidebar-module__active__fs957","caseTitle":"Sidebar-module__caseTitle__dvjmp","caseStatus":"Sidebar-module__caseStatus__CF0ig"});

/***/ }),

/***/ "./assets/js/styles/index.css":
/*!************************************!*\
  !*** ./assets/js/styles/index.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/js/utils/TokenUtils.js":
/*!***************************************!*\
  !*** ./assets/js/utils/TokenUtils.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyToClipboard: () => (/* binding */ copyToClipboard),
/* harmony export */   generateToken: () => (/* binding */ generateToken)
/* harmony export */ });
const generateToken = () => {
  return Math.random().toString(36).substring(2, 10);
};
const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./assets/js/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./assets/js/App.jsx");
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/index.css */ "./assets/js/styles/index.css");




 // Tailwind + custom styles

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("hr-support-chat-app");
  if (rootEl) {
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(rootEl);
    root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_App__WEBPACK_IMPORTED_MODULE_2__["default"], null));
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map