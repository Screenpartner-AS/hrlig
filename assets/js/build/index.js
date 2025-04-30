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
const apiFetch = async (endpoint, method = "GET", body = null, params = {}) => {
  const url = new URL(`${window.location.origin}/wp-json/hrsc/v1${endpoint}`);
  if (method === "GET" && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "Request failed");
  }
  return result;
};

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





const Chat = ({
  selectedCaseId,
  onSelectCase
}) => {
  const [caseId, setCaseId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(selectedCaseId || null);
  const {
    messages,
    refreshMessages,
    loading
  } = (0,_hooks_useMessages__WEBPACK_IMPORTED_MODULE_3__["default"])(caseId);
  const handleSelectCase = id => {
    setCaseId(id);
    onSelectCase?.(id);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex h-screen bg-gray-100"
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
      className: "flex-1 flex items-center justify-center text-gray-500"
    }, "Select a case to view messages");
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex flex-col h-screen bg-gray-50 relative"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 overflow-y-auto py-6 px-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mx-auto max-w-2xl space-y-6"
  }, !firstLoadDone ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-center text-sm text-gray-400 italic"
  }, "Loading conversation\u2026") : messages.length === 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-gray-400 text-center italic"
  }, "No messages yet. Start the conversation!") : null, statusMessage && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-center text-xs text-yellow-600 italic"
  }, statusMessage), messages.map((msg, idx) => {
    if (msg.is_system) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: idx,
        className: "text-center text-xs text-gray-400 italic"
      }, msg.content);
    }
    const bubbleClasses = msg.is_hr ? "bg-green-100 ml-auto text-gray-800" : "bg-white mr-auto border text-gray-800";
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: idx,
      className: "w-full"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${bubbleClasses}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-sm"
    }, msg.content), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-[11px] text-gray-400 mt-1 text-right"
    }, msg.author, " \u2022 ", new Date(msg.date).toLocaleTimeString())));
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: messagesEndRef
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "sticky bottom-0 bg-white border-t border-gray-200 w-full px-4 py-3"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "max-w-2xl mx-auto"
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
        website: "" // honeypot
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
    className: "w-full"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-end rounded-[28px] border border-gray-300 bg-white shadow-md px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
    ref: textareaRef,
    value: message,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    placeholder: "Type your message...",
    className: "flex-1 resize-none text-base placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none min-h-[48px] max-h-[300px] overflow-y-auto",
    rows: 1
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit",
    id: "composer-submit-button",
    "aria-label": "Send message",
    disabled: sending || !message.trim(),
    className: "flex items-center justify-center rounded-full h-9 w-9 transition-colors  bg-black text-white hover:opacity-70 disabled:bg-gray-300 disabled:text-white  dark:bg-white dark:text-black dark:disabled:bg-zinc-500 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black ml-3"
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



const SessionGate = ({
  children
}) => {
  const {
    session,
    updateSession,
    ready
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_contexts_SessionContext__WEBPACK_IMPORTED_MODULE_1__["default"]);
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    token: "",
    email: "",
    firstName: ""
  });
  const [anonymous, setAnonymous] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
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
  const handleSubmit = e => {
    e.preventDefault();
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
  };
  if (!ready) return null;
  if (session?.token || session?.email && session?.firstName) {
    return children;
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-100 px-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: handleSubmit,
    className: "bg-white p-6 rounded shadow w-full max-w-md"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-lg font-semibold mb-4 text-center"
  }, "Enter Your Chat Session"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex justify-center mb-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "mr-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "authMode",
    checked: anonymous,
    onChange: () => setAnonymous(true)
  }), " Anonymous"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "radio",
    name: "authMode",
    checked: !anonymous,
    onChange: () => setAnonymous(false)
  }), " Identified")), anonymous ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "block text-sm font-medium mb-1"
  }, "Access Token"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "token",
    value: form.token,
    onChange: handleChange,
    className: "w-full border px-3 py-2 rounded"
  })) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "block text-sm font-medium mb-1"
  }, "Email"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "email",
    name: "email",
    value: form.email,
    onChange: handleChange,
    className: "w-full border px-3 py-2 rounded"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "block text-sm font-medium mb-1"
  }, "First Name"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    name: "firstName",
    value: form.firstName,
    onChange: handleChange,
    className: "w-full border px-3 py-2 rounded"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "submit",
    className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
  }, "Continue")));
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
    className: "w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold mb-4"
  }, "Support Cases"), loading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-gray-500"
  }, "Loading\u2026"), error && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-red-600"
  }, error), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "space-y-2"
  }, cases.map(c => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: c.id,
    onClick: () => onSelectCase(c.id),
    className: `p-3 rounded cursor-pointer ${c.id === selectedCaseId ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "font-medium"
  }, c.title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-xs text-gray-500"
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
        const data = await (0,_api_apiClient__WEBPACK_IMPORTED_MODULE_1__.apiFetch)("/support-cases", "GET", null, {
          token: session.token,
          email: session.email,
          first_name: session.firstName
        });
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

/***/ "./assets/js/styles/index.css":
/*!************************************!*\
  !*** ./assets/js/styles/index.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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