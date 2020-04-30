angular.module("ngMultiUpload", []).directive("uploadSubmit", ["$parse", function() {
    function n(e, t) {
        e = angular.element(e);
        var a = e.parent();
        return t = t.toLowerCase(), a && a[0].tagName.toLowerCase() === t ? a : a ? n(a, t) : null
    }
    return {
        restrict: "AC",
        link: function(e, t) {
            t.bind("click", function(e) {
                if (e && (e.preventDefault(), e.stopPropagation()), !t.attr("disabled")) {
                    var a = n(t, "form");
                    a.triggerHandler("submit"), a[0].submit()
                }
            })
        }
    }
}]).directive("ngMultiUpload", ["$log", "$parse", "$document", "$browser", "$http", function(n, e, t, a, r) {
    function o(n) {
        var e, a = t.find("head");
        return angular.forEach(a.find("meta"), function(t) {
            t.getAttribute("name") === n && (e = t)
        }), angular.element(e)
    }

    function i() {
        return a.cookies()[r.defaults.xsrfCookieName || "X-XSRF-TOKEN"]
    }
    var l = 1;
    return {
        restrict: "AC",
        link: function(t, a, r) {
            function p(n) {
                t.$isUploading = n
            }

            function u() {
                m.unbind("load"), t.$$phase ? p(!1) : t.$apply(function() {
                    p(!1)
                });
                try {
                    var e, a = (m[0].contentDocument || m[0].contentWindow.document).body;
					
                    try {
						let content = a.innerText || a.textContent;
						if (content.indexOf('}{')>0) {
						    content = content.replace(/}{/g, '},{');
						}
						content = '['+content+']';
                        e = angular.fromJson(content), t.$$phase ? s(t, {
                            content: e
                        }) : t.$apply(function() {
                            s(t, {
                                content: e
                            })
                        })
                    } catch (r) {
                        e = a.innerHTML;
                        var o = "ng-multi-upload: Response is not valid JSON";
                        n.warn(o), f && (t.$$phase ? f(t, {
                            error: o
                        }) : t.$apply(function() {
                            f(t, {
                                error: o
                            })
                        }))
                    }
                } catch (o) {
                    n.warn("ng-multi-upload: Server error"), f && (t.$$phase ? f(t, {
                        error: o
                    }) : t.$apply(function() {
                        f(t, {
                            error: o
                        })
                    }))
                }
            }
            l++;
            var d = {},
                s = r.ngMultiUpload ? e(r.ngMultiUpload) : null,
                f = r.errorCatcher ? e(r.errorCatcher) : null,
                c = r.ngMultiUploadLoading ? e(r.ngMultiUploadLoading) : null;
            r.hasOwnProperty("uploadOptionsConvertHidden") && (d.convertHidden = "false" != r.uploadOptionsConvertHidden), r.hasOwnProperty("uploadOptionsEnableRailsCsrf") && (d.enableRailsCsrf = "false" != r.uploadOptionsEnableRailsCsrf), r.hasOwnProperty("uploadOptionsBeforeSubmit") && (d.beforeSubmit = e(r.uploadOptionsBeforeSubmit)), r.hasOwnProperty("uploadOptionsEnableCsrf") && (d.enableCsrf = "false" != r.uploadOptionsEnableCsrf), a.attr({
                target: "upload-iframe-" + l,
                method: "post",
                enctype: "multipart/form-data",
                encoding: "multipart/form-data"
            });
            var m = angular.element('<iframe name="upload-iframe-' + l + '" ' + 'border="0" width="0" height="0" ' + 'style="width:0px;height:0px;border:none;display:none">');
            if (d.enableRailsCsrf) {
                var g = angular.element("<input />");
                g.attr("class", "upload-csrf-token"), g.attr("type", "hidden"), g.attr("name", o("csrf-param").attr("content")), g.val(o("csrf-token").attr("content")), a.append(g)
            }
            if (d.enableCsrf) {
                var g = angular.element("<input />");
                g.attr("class", "upload-csrf-token"), g.attr("type", "hidden"), g.attr("name", r.uploadOptionsCsrfParam || "CSRFToken"), g.val(i()), a.append(g)
            }
            a.after(m), p(!1), a.bind("submit", function(n) {
                var e = t[r.name];
                return e && e.$invalid ? (n.preventDefault(), !1) : d.beforeSubmit && d.beforeSubmit(t, {}) === !1 ? (t.$$phase || t.$apply(), n.preventDefault(), !1) : (m.bind("load", u), d.convertHidden && angular.forEach(a.find("input"), function(n) {
                    var e = angular.element(n);
                    e.attr("ng-model") && e.attr("type") && "hidden" == e.attr("type") && e.attr("value", t.$eval(e.attr("ng-model")))
                }), t.$$phase ? (c && c(t), p(!0)) : t.$apply(function() {
                    c && c(t), p(!0)
                }), void 0)
            })
        }
    }
}]);