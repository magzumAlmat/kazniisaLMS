"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/courses/[id]/page",{

/***/ "(app-pages-browser)/./src/app/courses/[id]/page.js":
/*!**************************************!*\
  !*** ./src/app/courses/[id]/page.js ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ CourseDetail; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/navigation.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ \"(app-pages-browser)/./node_modules/react-redux/es/index.js\");\n/* harmony import */ var _store_slices_authSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/store/slices/authSlice */ \"(app-pages-browser)/./src/store/slices/authSlice.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ \"(app-pages-browser)/./node_modules/axios/lib/axios.js\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/styles */ \"(app-pages-browser)/./node_modules/@mui/material/styles/useTheme.js\");\n/* harmony import */ var _mui_material_Tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/material/Tabs */ \"(app-pages-browser)/./node_modules/@mui/material/Tabs/Tabs.js\");\n/* harmony import */ var _mui_material_Tab__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/Tab */ \"(app-pages-browser)/./node_modules/@mui/material/Tab/Tab.js\");\n/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/Typography */ \"(app-pages-browser)/./node_modules/@mui/material/Typography/Typography.js\");\n/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Box */ \"(app-pages-browser)/./node_modules/@mui/material/Box/Box.js\");\n/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/Paper */ \"(app-pages-browser)/./node_modules/@mui/material/Paper/Paper.js\");\n/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @mui/material/Button */ \"(app-pages-browser)/./node_modules/@mui/material/Button/Button.js\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/styles */ \"(app-pages-browser)/./node_modules/@mui/material/styles/styled.js\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! framer-motion */ \"(app-pages-browser)/./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n // Next.js 13+\n\n\n\n\n\n\n\n\n\n\n\n\nconst DateFormatter = (param)=>{\n    let { isoDate } = param;\n    const date = new Date(isoDate);\n    const formattedDate = date.toLocaleDateString(\"ru-RU\", {\n        day: \"2-digit\",\n        month: \"long\",\n        year: \"numeric\"\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n        children: formattedDate\n    }, void 0, false, {\n        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n        lineNumber: 27,\n        columnNumber: 10\n    }, undefined);\n};\n_c = DateFormatter;\nconst StyledTabs = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(_mui_material_Tabs__WEBPACK_IMPORTED_MODULE_6__[\"default\"])((param)=>{\n    let { theme } = param;\n    return {\n        \"& .MuiTabs-indicator\": {\n            backgroundColor: theme.palette.primary.main,\n            width: 3\n        }\n    };\n});\n_c1 = StyledTabs;\nconst StyledTab = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(_mui_material_Tab__WEBPACK_IMPORTED_MODULE_7__[\"default\"])((param)=>{\n    let { theme } = param;\n    return {\n        textTransform: \"none\",\n        fontWeight: theme.typography.fontWeightRegular,\n        fontSize: theme.typography.pxToRem(15),\n        color: theme.palette.text.secondary,\n        \"&.Mui-selected\": {\n            color: theme.palette.primary.main\n        },\n        \"&:hover\": {\n            color: theme.palette.primary.main,\n            opacity: 1\n        }\n    };\n});\n_c2 = StyledTab;\nfunction CourseDetail() {\n    _s();\n    const { id } = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useParams)(); // Получаем id из URL\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();\n    const thisCourse = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)((state)=>state.auth.currentCourse);\n    const loading = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)((state)=>state.auth.loadingCourse);\n    const error = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)((state)=>state.auth.courseError);\n    const [lessons, setLessons] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [activeTab, setActiveTab] = react__WEBPACK_IMPORTED_MODULE_1__.useState(0); // Текущая активная вкладка\n    const theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_8__[\"default\"])();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (id) {\n            dispatch((0,_store_slices_authSlice__WEBPACK_IMPORTED_MODULE_4__.getCourseByIdAction)(id)); // Загружаем курс\n        }\n        fetchLessons();\n    }, [\n        id,\n        dispatch\n    ]);\n    const fetchLessons = async ()=>{\n        try {\n            const response = await axios__WEBPACK_IMPORTED_MODULE_9__[\"default\"].get(\"http://localhost:4000/api/lessons\");\n            setLessons(response.data);\n        } catch (error) {\n            console.error(\"Ошибка при загрузке уроков:\", error);\n        }\n    };\n    const filteredLessons = lessons.filter((lesson)=>lesson.course_id === Number(id));\n    if (loading) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: \"Загрузка...\"\n    }, void 0, false, {\n        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n        lineNumber: 80,\n        columnNumber: 23\n    }, this);\n    if (error) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            \"Ошибка: \",\n            error\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n        lineNumber: 81,\n        columnNumber: 21\n    }, this);\n    // Проверка на наличие данных\n    if (!filteredLessons || filteredLessons.length === 0) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n            variant: \"h6\",\n            children: \"Нет доступных уроков.\"\n        }, void 0, false, {\n            fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n            lineNumber: 85,\n            columnNumber: 12\n        }, this);\n    }\n    const handleChangeTab = (event, newValue)=>{\n        setActiveTab(newValue);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_11__[\"default\"], {\n        sx: {\n            display: \"flex\",\n            flexGrow: 1,\n            bgcolor: \"background.paper\",\n            height: \"100%\"\n        },\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(StyledTabs, {\n                orientation: \"vertical\",\n                variant: \"scrollable\",\n                value: activeTab,\n                onChange: handleChangeTab,\n                \"aria-label\": \"Уроки курса\",\n                sx: {\n                    borderRight: 1,\n                    borderColor: \"divider\",\n                    width: \"200px\"\n                },\n                children: filteredLessons.map((lesson, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(StyledTab, {\n                        label: lesson.title\n                    }, lesson.id, false, {\n                        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                        lineNumber: 105,\n                        columnNumber: 11\n                    }, this))\n            }, void 0, false, {\n                fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                lineNumber: 96,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_11__[\"default\"], {\n                sx: {\n                    flexGrow: 1,\n                    p: 3\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_12__.motion.div, {\n                        initial: {\n                            opacity: 0\n                        },\n                        animate: {\n                            opacity: 1\n                        },\n                        transition: {\n                            duration: 0.5\n                        },\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__[\"default\"], {\n                            elevation: 3,\n                            sx: {\n                                p: 3,\n                                borderRadius: 2\n                            },\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n                                    variant: \"h5\",\n                                    children: filteredLessons[activeTab].title\n                                }, void 0, false, {\n                                    fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                                    lineNumber: 118,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n                                    variant: \"body1\",\n                                    sx: {\n                                        mt: 2\n                                    },\n                                    children: filteredLessons[activeTab].content\n                                }, void 0, false, {\n                                    fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                                    lineNumber: 119,\n                                    columnNumber: 13\n                                }, this),\n                                filteredLessons[activeTab].image && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                    src: filteredLessons[activeTab].image,\n                                    alt: \"Lesson \".concat(activeTab + 1),\n                                    style: {\n                                        width: \"100%\",\n                                        height: \"200px\",\n                                        objectFit: \"cover\",\n                                        marginTop: \"10px\",\n                                        borderRadius: \"8px\"\n                                    }\n                                }, void 0, false, {\n                                    fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                                    lineNumber: 123,\n                                    columnNumber: 15\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                            lineNumber: 117,\n                            columnNumber: 11\n                        }, this)\n                    }, activeTab, false, {\n                        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                        lineNumber: 111,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Button__WEBPACK_IMPORTED_MODULE_14__[\"default\"], {\n                        variant: \"contained\",\n                        color: \"primary\",\n                        sx: {\n                            mt: 4,\n                            display: \"block\",\n                            margin: \"auto\",\n                            borderRadius: 2\n                        },\n                        onClick: ()=>router.push(\"/courses\"),\n                        children: \"Назад к курсам\"\n                    }, void 0, false, {\n                        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                        lineNumber: 139,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n                lineNumber: 110,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/billionare/Documents/DEVELOPMENT/REACT/KazniisaLMSFrontend/frontend/src/app/courses/[id]/page.js\",\n        lineNumber: 93,\n        columnNumber: 5\n    }, this);\n}\n_s(CourseDetail, \"AGbixHYfUmnB9mW/CXeO/Rm6x14=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_2__.useParams,\n        next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter,\n        react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch,\n        react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector,\n        react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector,\n        react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector,\n        _mui_material_styles__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\n    ];\n});\n_c3 = CourseDetail;\nvar _c, _c1, _c2, _c3;\n$RefreshReg$(_c, \"DateFormatter\");\n$RefreshReg$(_c1, \"StyledTabs\");\n$RefreshReg$(_c2, \"StyledTab\");\n$RefreshReg$(_c3, \"CourseDetail\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvY291cnNlcy9baWRdL3BhZ2UuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDK0I7QUFDYTtBQUNXLENBQUMsY0FBYztBQUNmO0FBQ1E7QUFDckM7QUFDc0I7QUFDVjtBQUNGO0FBQ2M7QUFDZDtBQUNJO0FBQ0U7QUFDSTtBQUNQO0FBRXZDLE1BQU1rQixnQkFBZ0I7UUFBQyxFQUFFQyxPQUFPLEVBQUU7SUFDaEMsTUFBTUMsT0FBTyxJQUFJQyxLQUFLRjtJQUV0QixNQUFNRyxnQkFBZ0JGLEtBQUtHLGtCQUFrQixDQUFDLFNBQVM7UUFDckRDLEtBQUs7UUFDTEMsT0FBTztRQUNQQyxNQUFNO0lBQ1I7SUFFQSxxQkFBTyw4REFBQ0M7a0JBQUdMOzs7Ozs7QUFDYjtLQVZNSjtBQVlOLE1BQU1VLGFBQWFaLGdFQUFNQSxDQUFDTiwwREFBSUEsRUFBRTtRQUFDLEVBQUVtQixLQUFLLEVBQUU7V0FBTTtRQUM5Qyx3QkFBd0I7WUFDdEJDLGlCQUFpQkQsTUFBTUUsT0FBTyxDQUFDQyxPQUFPLENBQUNDLElBQUk7WUFDM0NDLE9BQU87UUFDVDtJQUNGO0FBQUE7TUFMTU47QUFPTixNQUFNTyxZQUFZbkIsZ0VBQU1BLENBQUNMLHlEQUFHQSxFQUFFO1FBQUMsRUFBRWtCLEtBQUssRUFBRTtXQUFNO1FBQzVDTyxlQUFlO1FBQ2ZDLFlBQVlSLE1BQU1TLFVBQVUsQ0FBQ0MsaUJBQWlCO1FBQzlDQyxVQUFVWCxNQUFNUyxVQUFVLENBQUNHLE9BQU8sQ0FBQztRQUNuQ0MsT0FBT2IsTUFBTUUsT0FBTyxDQUFDWSxJQUFJLENBQUNDLFNBQVM7UUFDbkMsa0JBQWtCO1lBQ2hCRixPQUFPYixNQUFNRSxPQUFPLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSTtRQUNuQztRQUNBLFdBQVc7WUFDVFMsT0FBT2IsTUFBTUUsT0FBTyxDQUFDQyxPQUFPLENBQUNDLElBQUk7WUFDakNZLFNBQVM7UUFDWDtJQUNGO0FB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b0NBQVFJLElBQUk7d0NBQUVxQixJQUFJO29DQUFFOzhDQUNyQ2hDLGVBQWUsQ0FBQ1AsVUFBVSxDQUFDd0MsT0FBTzs7Ozs7O2dDQUVwQ2pDLGVBQWUsQ0FBQ1AsVUFBVSxDQUFDeUMsS0FBSyxrQkFDL0IsOERBQUNDO29DQUNDQyxLQUFLcEMsZUFBZSxDQUFDUCxVQUFVLENBQUN5QyxLQUFLO29DQUNyQ0csS0FBSyxVQUF3QixPQUFkNUMsWUFBWTtvQ0FDM0I2QyxPQUFPO3dDQUNMdkUsT0FBTzt3Q0FDUGdELFFBQVE7d0NBQ1J3QixXQUFXO3dDQUNYQyxXQUFXO3dDQUNYVCxjQUFjO29DQUNoQjs7Ozs7Ozs7Ozs7O3VCQXBCRHRDOzs7OztrQ0EyQlAsOERBQUM3Qyw2REFBTUE7d0JBQ0wyRCxTQUFRO3dCQUNSaEMsT0FBTTt3QkFDTm9DLElBQUk7NEJBQUVxQixJQUFJOzRCQUFHcEIsU0FBUzs0QkFBUzZCLFFBQVE7NEJBQVFWLGNBQWM7d0JBQUU7d0JBQy9EVyxTQUFTLElBQU03RCxPQUFPOEQsSUFBSSxDQUFDO2tDQUM1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTVQ7R0FuR3dCaEU7O1FBQ1AzQyxzREFBU0E7UUFDVEMsc0RBQVNBO1FBQ1BDLG9EQUFXQTtRQUNUQyxvREFBV0E7UUFDZEEsb0RBQVdBO1FBQ2JBLG9EQUFXQTtRQUdYRyw0REFBUUE7OztNQVRBcUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2FwcC9jb3Vyc2VzL1tpZF0vcGFnZS5qcz9lMzUyIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VQYXJhbXMsIHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjsgLy8gTmV4dC5qcyAxMytcbmltcG9ydCB7IHVzZURpc3BhdGNoLCB1c2VTZWxlY3RvciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IHsgZ2V0Q291cnNlQnlJZEFjdGlvbiB9IGZyb20gXCJAL3N0b3JlL3NsaWNlcy9hdXRoU2xpY2VcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWwvc3R5bGVzXCI7XG5pbXBvcnQgVGFicyBmcm9tIFwiQG11aS9tYXRlcmlhbC9UYWJzXCI7XG5pbXBvcnQgVGFiIGZyb20gXCJAbXVpL21hdGVyaWFsL1RhYlwiO1xuaW1wb3J0IFR5cG9ncmFwaHkgZnJvbSBcIkBtdWkvbWF0ZXJpYWwvVHlwb2dyYXBoeVwiO1xuaW1wb3J0IEJveCBmcm9tIFwiQG11aS9tYXRlcmlhbC9Cb3hcIjtcbmltcG9ydCBQYXBlciBmcm9tIFwiQG11aS9tYXRlcmlhbC9QYXBlclwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiQG11aS9tYXRlcmlhbC9CdXR0b25cIjtcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gXCJAbXVpL21hdGVyaWFsL3N0eWxlc1wiO1xuaW1wb3J0IHsgbW90aW9uIH0gZnJvbSBcImZyYW1lci1tb3Rpb25cIjtcblxuY29uc3QgRGF0ZUZvcm1hdHRlciA9ICh7IGlzb0RhdGUgfSkgPT4ge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoaXNvRGF0ZSk7XG5cbiAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwicnUtUlVcIiwge1xuICAgIGRheTogXCIyLWRpZ2l0XCIsXG4gICAgbW9udGg6IFwibG9uZ1wiLFxuICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICB9KTtcblxuICByZXR1cm4gPHA+e2Zvcm1hdHRlZERhdGV9PC9wPjtcbn07XG5cbmNvbnN0IFN0eWxlZFRhYnMgPSBzdHlsZWQoVGFicykoKHsgdGhlbWUgfSkgPT4gKHtcbiAgXCImIC5NdWlUYWJzLWluZGljYXRvclwiOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkubWFpbixcbiAgICB3aWR0aDogMywgLy8g0KLQvtC70YnQuNC90LAg0LjQvdC00LjQutCw0YLQvtGA0LAg0LTQu9GPINCy0LXRgNGC0LjQutCw0LvRjNC90YvRhSDQstC60LvQsNC00L7QulxuICB9LFxufSkpO1xuXG5jb25zdCBTdHlsZWRUYWIgPSBzdHlsZWQoVGFiKSgoeyB0aGVtZSB9KSA9PiAoe1xuICB0ZXh0VHJhbnNmb3JtOiBcIm5vbmVcIixcbiAgZm9udFdlaWdodDogdGhlbWUudHlwb2dyYXBoeS5mb250V2VpZ2h0UmVndWxhcixcbiAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkucHhUb1JlbSgxNSksXG4gIGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5LFxuICBcIiYuTXVpLXNlbGVjdGVkXCI6IHtcbiAgICBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5Lm1haW4sXG4gIH0sXG4gIFwiJjpob3ZlclwiOiB7XG4gICAgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWluLFxuICAgIG9wYWNpdHk6IDEsXG4gIH0sXG59KSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvdXJzZURldGFpbCgpIHtcbiAgY29uc3QgeyBpZCB9ID0gdXNlUGFyYW1zKCk7IC8vINCf0L7Qu9GD0YfQsNC10LwgaWQg0LjQtyBVUkxcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG4gIGNvbnN0IGRpc3BhdGNoID0gdXNlRGlzcGF0Y2goKTtcbiAgY29uc3QgdGhpc0NvdXJzZSA9IHVzZVNlbGVjdG9yKChzdGF0ZSkgPT4gc3RhdGUuYXV0aC5jdXJyZW50Q291cnNlKTtcbiAgY29uc3QgbG9hZGluZyA9IHVzZVNlbGVjdG9yKChzdGF0ZSkgPT4gc3RhdGUuYXV0aC5sb2FkaW5nQ291cnNlKTtcbiAgY29uc3QgZXJyb3IgPSB1c2VTZWxlY3Rvcigoc3RhdGUpID0+IHN0YXRlLmF1dGguY291cnNlRXJyb3IpO1xuICBjb25zdCBbbGVzc29ucywgc2V0TGVzc29uc10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSBSZWFjdC51c2VTdGF0ZSgwKTsgLy8g0KLQtdC60YPRidCw0Y8g0LDQutGC0LjQstC90LDRjyDQstC60LvQsNC00LrQsFxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGRpc3BhdGNoKGdldENvdXJzZUJ5SWRBY3Rpb24oaWQpKTsgLy8g0JfQsNCz0YDRg9C20LDQtdC8INC60YPRgNGBXG4gICAgfVxuICAgIGZldGNoTGVzc29ucygpO1xuICB9LCBbaWQsIGRpc3BhdGNoXSk7XG5cbiAgY29uc3QgZmV0Y2hMZXNzb25zID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvbGVzc29uc1wiKTtcbiAgICAgIHNldExlc3NvbnMocmVzcG9uc2UuZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCLQntGI0LjQsdC60LAg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0YPRgNC+0LrQvtCyOlwiLCBlcnJvcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpbHRlcmVkTGVzc29ucyA9IGxlc3NvbnMuZmlsdGVyKChsZXNzb24pID0+IGxlc3Nvbi5jb3Vyc2VfaWQgPT09IE51bWJlcihpZCkpO1xuXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPGRpdj7Ql9Cw0LPRgNGD0LfQutCwLi4uPC9kaXY+O1xuICBpZiAoZXJyb3IpIHJldHVybiA8ZGl2PtCe0YjQuNCx0LrQsDoge2Vycm9yfTwvZGl2PjtcblxuICAvLyDQn9GA0L7QstC10YDQutCwINC90LAg0L3QsNC70LjRh9C40LUg0LTQsNC90L3Ri9GFXG4gIGlmICghZmlsdGVyZWRMZXNzb25zIHx8IGZpbHRlcmVkTGVzc29ucy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCI+0J3QtdGCINC00L7RgdGC0YPQv9C90YvRhSDRg9GA0L7QutC+0LIuPC9UeXBvZ3JhcGh5PjtcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZVRhYiA9IChldmVudCwgbmV3VmFsdWUpID0+IHtcbiAgICBzZXRBY3RpdmVUYWIobmV3VmFsdWUpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBzeD17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleEdyb3c6IDEsIGJnY29sb3I6IFwiYmFja2dyb3VuZC5wYXBlclwiLCBoZWlnaHQ6IFwiMTAwJVwiIH19PlxuICAgICAgXG4gICAgICB7Lyog0JLQtdGA0YLQuNC60LDQu9GM0L3Ri9C1INCy0LrQu9Cw0LTQutC4ICovfVxuICAgICAgPFN0eWxlZFRhYnNcbiAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXG4gICAgICAgIHZhcmlhbnQ9XCJzY3JvbGxhYmxlXCJcbiAgICAgICAgdmFsdWU9e2FjdGl2ZVRhYn1cbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZVRhYn1cbiAgICAgICAgYXJpYS1sYWJlbD1cItCj0YDQvtC60Lgg0LrRg9GA0YHQsFwiXG4gICAgICAgIHN4PXt7IGJvcmRlclJpZ2h0OiAxLCBib3JkZXJDb2xvcjogXCJkaXZpZGVyXCIsIHdpZHRoOiBcIjIwMHB4XCIgfX1cbiAgICAgID5cbiAgICAgICAge2ZpbHRlcmVkTGVzc29ucy5tYXAoKGxlc3NvbiwgaW5kZXgpID0+IChcbiAgICAgICAgICA8U3R5bGVkVGFiIGtleT17bGVzc29uLmlkfSBsYWJlbD17bGVzc29uLnRpdGxlfSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvU3R5bGVkVGFicz5cblxuICAgICAgey8qINCa0L7QvdGC0LXQvdGCINCw0LrRgtC40LLQvdC+0LPQviDRg9GA0L7QutCwICovfVxuICAgICAgPEJveCBzeD17eyBmbGV4R3JvdzogMSwgcDogMyB9fT5cbiAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICBrZXk9e2FjdGl2ZVRhYn1cbiAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjUgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxQYXBlciBlbGV2YXRpb249ezN9IHN4PXt7IHA6IDMsIGJvcmRlclJhZGl1czogMiB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPntmaWx0ZXJlZExlc3NvbnNbYWN0aXZlVGFiXS50aXRsZX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBzeD17eyBtdDogMiB9fT5cbiAgICAgICAgICAgICAge2ZpbHRlcmVkTGVzc29uc1thY3RpdmVUYWJdLmNvbnRlbnR9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICB7ZmlsdGVyZWRMZXNzb25zW2FjdGl2ZVRhYl0uaW1hZ2UgJiYgKFxuICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgc3JjPXtmaWx0ZXJlZExlc3NvbnNbYWN0aXZlVGFiXS5pbWFnZX1cbiAgICAgICAgICAgICAgICBhbHQ9e2BMZXNzb24gJHthY3RpdmVUYWIgKyAxfWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgICAgICAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiMTBweFwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvUGFwZXI+XG4gICAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgICB7Lyog0JrQvdC+0L/QutCwIFwi0J3QsNC30LDQtCDQuiDQutGD0YDRgdCw0LxcIiAqL31cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgc3g9e3sgbXQ6IDQsIGRpc3BsYXk6IFwiYmxvY2tcIiwgbWFyZ2luOiBcImF1dG9cIiwgYm9yZGVyUmFkaXVzOiAyIH19XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gcm91dGVyLnB1c2goXCIvY291cnNlc1wiKX1cbiAgICAgICAgPlxuICAgICAgICAgINCd0LDQt9Cw0LQg0Log0LrRg9GA0YHQsNC8XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59Il0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VQYXJhbXMiLCJ1c2VSb3V0ZXIiLCJ1c2VEaXNwYXRjaCIsInVzZVNlbGVjdG9yIiwiZ2V0Q291cnNlQnlJZEFjdGlvbiIsImF4aW9zIiwidXNlVGhlbWUiLCJUYWJzIiwiVGFiIiwiVHlwb2dyYXBoeSIsIkJveCIsIlBhcGVyIiwiQnV0dG9uIiwic3R5bGVkIiwibW90aW9uIiwiRGF0ZUZvcm1hdHRlciIsImlzb0RhdGUiLCJkYXRlIiwiRGF0ZSIsImZvcm1hdHRlZERhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJkYXkiLCJtb250aCIsInllYXIiLCJwIiwiU3R5bGVkVGFicyIsInRoZW1lIiwiYmFja2dyb3VuZENvbG9yIiwicGFsZXR0ZSIsInByaW1hcnkiLCJtYWluIiwid2lkdGgiLCJTdHlsZWRUYWIiLCJ0ZXh0VHJhbnNmb3JtIiwiZm9udFdlaWdodCIsInR5cG9ncmFwaHkiLCJmb250V2VpZ2h0UmVndWxhciIsImZvbnRTaXplIiwicHhUb1JlbSIsImNvbG9yIiwidGV4dCIsInNlY29uZGFyeSIsIm9wYWNpdHkiLCJDb3Vyc2VEZXRhaWwiLCJpZCIsInJvdXRlciIsImRpc3BhdGNoIiwidGhpc0NvdXJzZSIsInN0YXRlIiwiYXV0aCIsImN1cnJlbnRDb3Vyc2UiLCJsb2FkaW5nIiwibG9hZGluZ0NvdXJzZSIsImVycm9yIiwiY291cnNlRXJyb3IiLCJsZXNzb25zIiwic2V0TGVzc29ucyIsImFjdGl2ZVRhYiIsInNldEFjdGl2ZVRhYiIsImZldGNoTGVzc29ucyIsInJlc3BvbnNlIiwiZ2V0IiwiZGF0YSIsImNvbnNvbGUiLCJmaWx0ZXJlZExlc3NvbnMiLCJmaWx0ZXIiLCJsZXNzb24iLCJjb3Vyc2VfaWQiLCJOdW1iZXIiLCJkaXYiLCJsZW5ndGgiLCJ2YXJpYW50IiwiaGFuZGxlQ2hhbmdlVGFiIiwiZXZlbnQiLCJuZXdWYWx1ZSIsInN4IiwiZGlzcGxheSIsImZsZXhHcm93IiwiYmdjb2xvciIsImhlaWdodCIsIm9yaWVudGF0aW9uIiwidmFsdWUiLCJvbkNoYW5nZSIsImFyaWEtbGFiZWwiLCJib3JkZXJSaWdodCIsImJvcmRlckNvbG9yIiwibWFwIiwiaW5kZXgiLCJsYWJlbCIsInRpdGxlIiwiaW5pdGlhbCIsImFuaW1hdGUiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJlbGV2YXRpb24iLCJib3JkZXJSYWRpdXMiLCJtdCIsImNvbnRlbnQiLCJpbWFnZSIsImltZyIsInNyYyIsImFsdCIsInN0eWxlIiwib2JqZWN0Rml0IiwibWFyZ2luVG9wIiwibWFyZ2luIiwib25DbGljayIsInB1c2giXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/courses/[id]/page.js\n"));

/***/ })

});