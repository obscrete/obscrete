var Mixmesh = (function() {
    var lockedScreen = false;
    var navbarAnimation = null;

    return {
        get: function(url, success) {
            var lockOwner = Mixmesh.lockScreen();
            $.get(url, null, function(data, status) {
                Mixmesh.unlockScreen(lockOwner);
                success(data, status);
            });
        },
        post: function(url, data, success, error) {
            var lockOwner = Mixmesh.lockScreen();
            $.ajax(url, {
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "POST",
                success: function(data, textStatus, jqXHR) {
                    Mixmesh.unlockScreen(lockOwner);
                    success(data, textStatus, jqXHR);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Mixmesh.unlockScreen(lockOwner);
                    error(jqXHR, textStatus, errorThrown);
                }
            });
        },
        put: function(url, data, success, error) {
            var lockOwner = Mixmesh.lockScreen();
            $.ajax(url, {
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "PUT",
                success: function(data, textStatus, jqXHR) {
                    Mixmesh.unlockScreen(lockOwner);
                    success(data, textStatus, jqXHR);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Mixmesh.unlockScreen(lockOwner);
                    error(jqXHR, textStatus, errorThrown);
                }
            });
        },
        lockScreen: function() {
            if (!lockedScreen) {
                $("#lock-screen").css("display", "block");
                var span = $(".uk-active span");
                span.addClass("uk-animation-shake");
                navbarAnimation =
                    setInterval(function() {
                        span.removeClass("uk-animation-shake");
                        setTimeout(function() {
                            span.addClass("uk-animation-shake");
                        }, 100);
                    }, 750);
                lockedScreen = true;
                return true;
            } else {
                return false;
            }
        },
        unlockScreen: function(lockOwner) {
            if (lockOwner) {
                $("#lock-screen").css("display", "none");
                lockedScreen = false;
                clearInterval(navbarAnimation);
                $(".uk-active span").removeClass("uk-animation-shake");
            }
        },
        setHeight: function(targetId, siblingIds) {
            var targetHeight = window.innerHeight;
            for (i = 0; i < siblingIds.length; i++) {
                targetHeight -= $(siblingIds[i]).outerHeight(true);
            }
            $(targetId).outerHeight(targetHeight.toString() + "px", true);
        },
        setClass: function(id, newClass, oldClass) {
            if (!$(id).hasClass(newClass)) {
                $(id).removeClass(oldClass);
                $(id).addClass(newClass);
            }
        },
        formatAmount: function(n, what) {
            if (typeof n == "string") {
                n = parseInt(n);
            }
            if (n == 0) {
                return "zero " + what + "s";
            } else if (n == 1) {
                return "one " + what;
            } else {
                return n.toString() + " " + what + "s";
            }
        },
        validInput: function(id) {
            Mixmesh.setClass(id, "uk-form-success", "uk-form-danger");
        },
        invalidInput: function(id) {
            Mixmesh.setClass(id, "uk-form-danger", "uk-form-success");
        },
        clearInput: function(id) {
            $(id).removeClass("uk-form-danger").removeClass("uk-form-success");
        },
        passwordKeyupHandler: function(id, callback) {
            var idAgain = id + "-again";
            var handler = function() {
                if ($(id).val().length < 6) {
                    Mixmesh.invalidInput(id);
                    Mixmesh.invalidInput(idAgain);
                } else {
                    Mixmesh.validInput(id);
                    if ($(id).val() == $(idAgain).val()) {
                        Mixmesh.validInput(idAgain);
                    } else {
                        Mixmesh.invalidInput(idAgain);
                    }
                }
                callback();
            };
            return handler;
        },
        portKeyupHandler: function(id, callback) {
            var handler = function() {
                var port = parseInt($(id).val());
                if (!isNaN(port) && port > 0 && port < 65536) {
                    Mixmesh.setClass(this, "uk-form-success", "uk-form-danger");
                } else {
                    Mixmesh.setClass(this, "uk-form-danger", "uk-form-success");
                }
                callback();
            };
            return handler;
        },
        passwordLockHandler: function(id) {
            var handler = function() {
                if ($(id).attr("type") == "password") {
                    $(id).attr("type", "text");
                    $(id + "-again").attr("type", "text");
                    $(this).attr("uk-icon", "icon: unlock");
                } else {
                    $(id).attr("type", "password");
                    $(id + "-again").attr("type", "password");
                    $(this).attr("uk-icon", "icon: lock");
                }
            }
            return handler;
        },
        showGenericDialog: function(params) {
            if (params.title) {
                $("#generic-dialog-title").text(params.title);
                $("#generic-dialog-title").show();
            } else {
                $("#generic-dialog-title").hide();
            }

            if (params.oncancel) {
                $("#generic-dialog-cancel").click(params.oncancel);
                $("#generic-dialog-cancel").show();
            } else {
                $("#generic-dialog-cancel").hide();
            }

            if (params.onok) {
                $("#generic-dialog-ok").click(params.onok);
                $("#generic-dialog-ok").show();
            } else {
                $("#generic-dialog-ok").hide();
            }

            if (params.oncancel && params.onok) {
                Mixmesh.setClass("#generic-dialog-ok", "uk-button-primary",
                                 "uk-button-default");
            } else {
                Mixmesh.setClass("#generic-dialog-ok", "uk-button-default",
                                 "uk-button-primary");
            }

            if (params.content) {
                $("#generic-dialog-content").html(params.content);
                $("#generic-dialog-content").show();
            } else {
                $("#generic-dialog-content").hide();
            }

            UIkit.modal("#generic-dialog").show();
        },
        hideGenericDialog: function(params) {
            UIkit.modal("#generic-dialog").hide();
        },
        formatError: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR && jqXHR.response && typeof jqXHR.response == "string" &&
                jqXHR.response.length > 0) {
                return jqXHR.response;
            } else if (jqXHR && jqXHR.responseText &&
                       typeof jqXHR.responseText == "string" &&
                       jqXHR.responseText.length > 0) {
                return jqXHR.responseText;
            } else if (textStatus && typeof textStatus == "string" &&
                       textStatus.length > 0) {
                if (errorThrown && typeof errorThrown == "string" &&
                    errorThrown.length > 0) {
                    return textStatus + " (" + errorThrown + ")";
                } else {
                    return textStatus;
                }
            } else if (errorThrown && typeof errorThrown == "string" &&
                       errorThrown.length > 0) {
                return errorThrown;
            } else {
                if (jqXHR && jqXHR.readyState == 4 && jqXHR.status == 0) {
                    return "Network error";
                } else {
                    return "Internal error";
                }
            }
        }
    };
})();
