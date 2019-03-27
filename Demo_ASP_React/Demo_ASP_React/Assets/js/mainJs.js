//var spinner = new Spinner().spin();
var validator;
var subValidator = null;
var listIPDetails = [];
var spinner = null;
var formStringify = "";
var enumMethod = {
    Post: 'POST',
    Get: 'GET'
};
(function ($) {
    (async function () {
        try {
            var response = await $.ajax({ url: '/Home/GetConfig' });
            $.getServerUpload = response["serverUpload"];
            $.getServerUploadReport = response["serverUploadReport"];
            $.getServerDownload = response["serverDownload"];
            $.getSaveFileUrl = response["saveFileUrl"];
            $.getSaveFileExportUrl = response["saveFileExportUrl"];
            $.getServerUrl = response["serverUrl"];
        }
        catch (error) { }
    })();

    $.appendSpin = function () {
        //spinner = new Spinner().spin();
        //if (!$('body').hasClass('body-overflow')) {
        //    $('body').append("<div class='overlay'></div>");
        //    $(".overlay").append(spinner.el);
        //    $("body").addClass("body-overflow");
        //}
    };

    $.removeSpin = function () {
        if ($('body').hasClass('body-overflow')) {
            $("body").removeClass("body-overflow");
            setTimeout(function () {
                spinner.stop();
                $(".overlay").remove();
            }, 500);
        }
    };

    $.notifySuccess = function (response) {
        var pNotify = new PNotify({
            title: 'Thành công!',
            text: response.Message,
            type: 'success',
            styling: 'brighttheme',
            delay: 3000
        });
    };

    $.notifyError = function (response) {
        if (response.StatusCode == 500) {
            //$.alert({
            //    title: "Có lỗi xảy ra",
            //    content: response.Message,
            //    type: 'red',
            //    columnClass: "small",
            //    buttons: {
            //        confirm: {
            //            text: "Đóng",
            //            btnClass: 'btn-blue'
            //        }
            //    }
            //});
            var pNotify = new PNotify({
                title: 'Có lỗi xảy ra!',
                text: response.Message,
                type: 'error',
                styling: 'brighttheme',
                delay: 3000
            });
        } else if (response.StatusCode == 701) {
            var pNotify1 = new PNotify({
                title: 'Cảnh báo',
                text: response.Message,
                type: 'warning',
                styling: 'brighttheme',
                delay: 3000
            });
        } else if (response.StatusCode == 406) {
            var pNotify1 = new PNotify({
                title: 'Cảnh báo',
                text: response.Message,
                type: 'warning',
                styling: 'brighttheme',
                delay: 3000
            });
        } else {
            var pNotify = new PNotify({
                title: 'Có lỗi xảy ra!',
                text: response.Message,
                type: 'error',
                styling: 'brighttheme',
                delay: 3000
            });
        }
    };

    $.notifyErrorCustom = function (message) {
        var pNotify = new PNotify({
            title: 'Chú ý!',
            text: message,
            type: 'error',
            styling: 'brighttheme'
        });
    }

    $.notifyWarning = function (options) {
        var pNotify;
        if (options != null) {
            pNotify = new PNotify(options);
        } else {
            pNotify = new PNotify({
                title: 'Chú ý!',
                text: "Không có dòng nào được chọn.",
                type: 'warning',
                styling: 'brighttheme'
            });
        }
    };
    $.customConfirm = function (options) {
        new PNotify({
            title: 'Xác nhận',
            text: options.textConfirm,
            icon: 'glyphicon glyphicon-question-sign',
            hide: false,
            confirm: {
                confirm: true,
                buttons: [{
                    text: options.textBtnOk || 'Có',
                    click: function (notice) {
                        notice.remove();
                        blocking = false;
                        if (options.onOk)
                            options.onOk();
                    }
                },
                {
                    text: options.textBtnCancel || 'Không',
                    click: function (notice) {
                        notice.remove();
                        blocking = false;
                        if (options.onCancel)
                            options.onCancel();
                    }
                }
                ]
            },
            buttons: {
                closer: false,
                sticker: false
            },
            addclass: 'stack-modal',
            stack: {
                'dir1': 'down',
                'dir2': 'right',
                'modal': true
            }
        });
    };
    // Hiển thị tiền tệ 100000 => 100,000
    $.fn.formatNumber = function () {
        this.number(true, 0, ".", ",");
    }
    // Hiển thị tiền tệ 100000 => 100,000.00
    $.fn.formatNumber2 = function () {
        this.number(true, 2, ".", ",");
    }

    $.fn.openModal = function (content) {
        if (content != null && content.length > 0) {
            this.html(content);
            validator = this.find('form').validate();
            $.loadEventModal();
            $.initDatepicker();
            this.initICheck();
            $.initSelect2();
            this.focusFirstInput();
            //chỉ cho nhập số
            $(".currency").formatNumber();
            $('.currency2').formatNumber2();
            if ($('#subModal').length > 0) {
                $.loadSubformEvent();
                //TODO: Insurance Program
                if (this.find('table.bulk_action').length > 0) {
                    $.loadEventRowClick();
                    $.loadActiveSubControl();
                    if ($("#JsonListIPDetails").val() != "") {
                        var obj = JSON.parse($("#JsonListIPDetails").val());
                        listIPDetails = obj;
                    }
                }
            }

            //Todo: Load event of myModal
            if (window.loadMainModalEvent != null && window.loadMainModalEvent != undefined) {
                window.loadMainModalEvent();
            }
            formStringify = JSON.stringify($("#myModal form").serializeObject());
        }
        $(this).modal({ backdrop: 'static', keyboard: false });
        $(this).modal('show');
    };
    //Todo: Insurance program
    $.fn.openSubModal = function (content) {
        if (content != null && content.length > 0) {
            this.html(content);
            subValidator = this.find('form').validate();
            $.loadEventSubModal();
            $.initDatepicker();
            this.initICheck();
            $("#subModal .currency").formatNumber();
            $('#subModal .currency2').formatNumber2();
            if ($("#Guid").val() == "") {
                $("#Guid").val($.generateGuid());
            }

            if (window.loadSubModalEvent != null && window.loadSubModalEvent != undefined) {
                window.loadSubModalEvent();
            }
        }
        $(this).modal({ backdrop: 'static', keyboard: false });
        $(this).modal('show');
    };

    $.fn.hideModal = function () {
        $(this).html('');
        $(this).modal('hide');
    };

    $.postStringify = function (url, data, isAsync, callback) {
        $.appendSpin();
        $.ajax({
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            type: 'POST',
            async: isAsync,
            success: function (response) {
                $.removeSpin();
                if (response.StatusCode == 401) {
                    window.location.href = response.Data;
                }
                if (callback != null && callback != undefined) {
                    callback(response);
                } else {
                    if (response.Success) {
                        $.notifySuccess(response);
                    } else {
                        $.notifyError(response);
                    }
                }
            },
            error: function (error) {
                $.removeSpin();
                console.log(error);
            }
        });
    };

    $.fn.submitForm = function (callback) {
        var url = $(this).attr('action');
        if ($(this).valid()) {
            var obj = $(this).serializeObject();
            $.postStringify(url, obj, true, function (response) {
                if (response.StatusCode == 401) {
                    window.location.href = response.Data;
                }
                if (response.Success) {
                    if (callback != null && callback != undefined) {
                        callback(response);
                    } else {
                        $.notifySuccess(response);
                    }
                } else {
                    $('label.error').hide();
                    $('input').removeClass('error');
                    if (subValidator != null && subValidator != undefined) {
                        subValidator.showErrors(response.Errors);
                    } else {
                        validator.showErrors(response.Errors);
                    }
                    if (response.Errors == null || response.Errors == undefined) {
                        $.notifyError(response);
                    }
                }
            });
        } else {
            validator.showErrors(validator.errorMap, validator.errorList);
            $(this).focusFirstErrorInput();
        }
    };

    $.fn.submitFormJson = function (callback) {
        var url = $(this).attr('action');
        if ($(this).valid()) {
            var obj = {
                json: JSON.stringify($(this).serializeObject())
            };
            $.callAjax(url, obj, enumMethod.Post, true, function (response) {
                if (response.StatusCode == 401) {
                    window.location.href = response.Data;
                }
                if (response.Success) {
                    if (callback != null && callback != undefined) {
                        callback(response);
                    } else {
                        $.notifySuccess(response);
                    }
                } else {
                    $('label.error').hide();
                    $('input').removeClass('error');
                    if (subValidator != null && subValidator != undefined) {
                        subValidator.showErrors(response.Errors);
                    } else {
                        validator.showErrors(response.Errors);
                    }
                    if (response.Errors == null || response.Errors == undefined) {
                        $.notifyError(response);
                    }
                }
            });
        } else {
            validator.showErrors(validator.errorMap, validator.errorList);
            $(this).focusFirstErrorInput();
        }
    };

    $.callAjax = function (url, data, method, isAsync, callback) {
        //$.appendSpin();
        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            type: method,
            async: isAsync,
            success: function (response) {
                //$.removeSpin();
                if (response.StatusCode == 401) {
                    window.location.href = response.Data;
                }
                if (callback != null && callback != undefined) {
                    callback(response);
                } else {
                    if (response.Success) {
                        $.notifySuccess(response);
                    } else {
                        $.notifyError(response);
                    }
                }
            },
            error: function (error) {
                $.removeSpin();
                console.log(error);
            }
        });
    };

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        $(this).find('select').map(function () {
            var attrMunti = $(this).attr('multiple');
            if (typeof attrMunti !== typeof undefined && attrMunti !== false) {
                var name = $(this).attr('name');
                var value = $(this).val();
                if ($.isArray(value)) {
                    var valueJoin = value.join(",");
                    o[name] = valueJoin;
                } else {
                    o[name] = value;
                }
            }
        });
        $(this).find('input[type=checkbox]').map(function () {
            var name = $(this).attr('name');
            var value = $(this).is(":checked");
            o[name] = value;
        });

        $(this).find('input[type=radio]').map(function () {
            var name = $(this).attr('name');
            var value = $('input[name=' + name + ']:checked').val();
            o[name] = value;
        });
        return o;
    };
    $.fn.focusFirstErrorInput = function () {
        this.find("input.form-control.error, textarea.form-control.error, input.input-validation-error, textarea.input-validation-error").first().focus();
    }
    $.loadEventModal = function () {
        $(".btn-save").on('click', function (e) {

            if (window.savefnc != null && window.savefnc != undefined) {
                window.savefnc();
            } else {
                e.preventDefault();
                var $modal = $(this).parents(".modal");
                var $form = $(this).parents(".modal").find('form');
                $form.submitForm(function (response) {
                    $.notifySuccess(response);
                    $modal.hideModal();
                    $.reloadData();
                });
            }
        });

        $(".btn-save-js").on('click', function (e) {

            if (window.savefnc != null && window.savefnc != undefined) {
                window.savefnc();
            } else {
                e.preventDefault();
                var $modal = $(this).parents(".modal");
                var $form = $(this).parents(".modal").find('form');
                $form.submitFormJson(function (response) {
                    $.notifySuccess(response);
                    $modal.hideModal();
                    $.reloadData();
                });
            }
        });

        $(".btn-close").on('click', function () {
            var $modal = $(this).parents(".modal");
            $modal.hideModal();
        });
    }

    $.loadEventSubModal = function () {
    }

    $.loadEventTable = function () {

        /* action button for main modal*/
        $(".btn-add-item").on('click', function () {
            var urlGetContent = $(this).attr('url-content');
            $.appendSpin();
            $.callAjax(urlGetContent, null, enumMethod.Get, true, function (response) {
                $.removeSpin();
                if (response.Success) {
                    $("#myModal").openModal(response.Data);
                } else {
                    $.notifyError(response);
                }
            });
        });

        $('table.bulk_action td').dblclick(function () {
            var itemId = $(this).parent().attr("item-id");
            var langCode = $(this).parent().attr('item-langcode');
            var urlGetContent = $(this).parents('.x_content').find("#url-view").val();
            if (itemId != undefined && itemId != "" && urlGetContent != undefined && urlGetContent != "") {
                $.appendSpin();
                $.callAjax(urlGetContent, {
                    id: itemId,
                    lang: langCode
                }, enumMethod.Get, true, function (response) {
                    $.removeSpin();
                    if (response.Success) {
                        $("#myModal").openModal(response.Data);
                    } else {
                        $.notifyError(response);
                    }
                });
            }
        });

        $(".btn-update-item").on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var urlGetContent = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var itemId = $(table).find("tr.selected").attr("item-id"),
                    itemLang = $(table).find("tr.selected").attr("item-langcode"),
                    itemStatus = $(table).find("tr.selected").attr("item-status");
                $.appendSpin();
                if ($(this).attr('is-redirect')) {
                    if (itemStatus == 5) {
                        $.notifyWarning({
                            title: 'Chú ý!',
                            text: "Bạn phải gỡ đăng trước!",
                            type: 'warning',
                            styling: 'bootstrap3'
                        });
                        $.removeSpin();
                    } else {
                        var langhref = "";
                        if (typeof itemLang !== "undefined") {
                            langhref = "&lang=" + itemLang;
                        }
                        location.href = urlGetContent + "?id=" + itemId + langhref;
                    }
                } else {
                    $.callAjax(urlGetContent, { id: itemId }, enumMethod.Get, true, function (response) {
                        $.removeSpin();
                        if (response.Success) {
                            $("#myModal").openModal(response.Data);
                        } else {
                            $.notifyError(response);
                        }
                        //$("#myModal").find('form').attr('action', urlGetContent);
                    });
                }

            } else {
                console.log("error");
            }
        });

        $(".btn-remove-item").on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var urlRemove = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length === 1 && $(table).find("tr.selected").attr('item-id') != "") {
                var itemStatus = $(table).find("tr.selected").attr("item-status"),
                    langcode = $(table).find("tr.selected").attr("item-langcode");
                if (itemStatus == 5) {
                    $.notifyWarning({
                        title: 'Chú ý!',
                        text: "Bạn phải gỡ đăng trước!",
                        type: 'warning',
                        styling: 'bootstrap3'
                    });
                } else if (itemStatus == 7) {
                    $.notifyWarning({
                        title: 'Chú ý!',
                        text: "Bài viết đã được xóa trước đó!",
                        type: 'warning',
                        styling: 'bootstrap3'
                    });
                } else {
                    $.confirm({
                        title: "Xác nhận xóa",
                        content: 'Bạn có muốn xóa dòng này?',
                        buttons: {
                            confirm: {
                                text: "Đồng ý",
                                btnClass: 'btn-blue',
                                action: function () {
                                    var itemId = $(table).find("tr.selected").attr("item-id");
                                    $.callAjax(urlRemove, { id: itemId, langcode: langcode }, enumMethod.Post, true, function (response) {
                                        if (response.Success) {
                                            $.reloadData();
                                            // $.notifySuccess(response);
                                        } else {
                                            $.notifyError(response);
                                        }
                                    });
                                }

                            },
                            cancel: {
                                text: "Hủy",
                                action: function () {
                                    //$.alert('Canceled!');
                                }
                            }
                        }
                    });
                }

            } else {
                console.log("error");
            }
        });

        $('.btn-export-item').on('click', function (e) {
            $.appendSpin();
            e.preventDefault();
            var $form = $("#frmFilter");
            var url = $(this).attr('url-content');
            var obj = $form.serializeObject();
            $.postStringify(url, obj, true, function (response) {
                if (response.Success) {
                    if (response.TypeDownload == 'xlsx') {
                        window.location.href = "/Report/Download?fileName=" + response.Data;
                    } else {
                        window.location.href = "/Report/DownloadXls?fileName=" + response.Data;
                    }

                } else {
                    $.notifyError(response);
                }
            });
        });

        $('.btn-change-news-status').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            $.appendSpin();
            var urlGetContent = $(this).attr('url-content');
            // itemStatus = $("#NewsStatus").val();
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var itemId = $(table).find("tr.selected").attr("item-id"),
                    itemStatus = $(table).find("tr.selected").attr("item-status"),
                    langcode = $(table).find("tr.selected").attr("item-langcode");
                $.appendSpin();
                if (itemStatus == 7) {
                    $.notifyWarning({
                        title: 'Chú ý!',
                        text: "Bài viết đã được xóa trước đó!",
                        type: 'warning',
                        styling: 'bootstrap3'
                    });
                    $.removeSpin();
                } else {
                    $.callAjax(urlGetContent, { id: itemId, status: itemStatus, langcode: langcode }, enumMethod.Get, true, function (response) {
                        $.removeSpin();
                        if (response.Success) {
                            $("#myModal").openModal(response.Data);
                        } else {
                            $.notifyError(response);
                        }
                    });
                }
            } else {
                console.log("error");
            }
        });

        $('.btn-comment-item').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            $.appendSpin();
            var urlGetContent = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var itemId = $(table).find("tr.selected").attr("item-id"),
                    itemTitle = $(table).find("tr.selected").attr("item-name");
                $.appendSpin();
                location.href = urlGetContent + "?id=" + itemId + "&title=" + itemTitle;
            } else {
                console.log("error");
            }
        });

        $('.btn-survey-item').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var urlGetContent = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var itemId = $(table).find("tr.selected").attr("item-id"),
                    itemLang = $(table).find("tr.selected").attr("item-langcode"),
                    itemStatus = $(table).find("tr.selected").attr("item-status"),
                    name = $(table).find("tr.selected").attr("item-name");
                $.appendSpin();
                if ($(this).attr('is-redirect')) {
                    if (itemStatus == 5) {
                        $.notifyWarning({
                            title: 'Chú ý!',
                            text: "Bạn phải gỡ đăng trước!",
                            type: 'warning',
                            styling: 'bootstrap3'
                        });
                        $.removeSpin();
                    } else {
                        var langhref = "";
                        if (typeof itemLang !== "undefined") {
                            langhref = "&LangCode=" + itemLang;
                        }
                        var parname = "";
                        if (typeof name != "undefined") {
                            parname = "&name=" + name;
                        }
                        location.href = urlGetContent + "?id=" + itemId + langhref + parname;
                    }
                }

            } else {
                console.log("error");
            }
        });

        $('.btn-edit-other-lang').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            $.appendSpin();
            var urlGetContent = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var itemId = $(table).find("tr.selected").attr("item-id");
                $.appendSpin();
                location.href = urlGetContent + "?id=" + itemId;
            } else {
                console.log("error");
            }
        });
        /* End */
    }

    $.loadEventPaging = function () {
        $('.page-size').on('change', function () {
            var number = $(this).val();
            $("#PageSize").val(number);
            $("#PageNumber").val(1);
            $.reloadData();
        });

        $('.page-number').on('click', function () {
            var number = $(this).attr('page-number');
            $("#PageNumber").val(number);
            $.reloadData();
        });
    }

    /* Action button for child modal */
    $.loadSubformEvent = function () {
        $.loadEventRowClick();
        $(".btn-add-subitem").on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var urlGetContent = $(this).attr('url-content');
            $.callAjax(urlGetContent, null, enumMethod.Get, function (response) {
                if (response.Success) {
                    $("#subModal").openSubModal(response.Data);
                } else {
                    $.notifyError(response);
                }
            });
        });

        $('#myModal table.bulk_action td').dblclick(function () {
            var urlGetContent = $("#sub-url-view").val();
            var guid = $(this).parent().attr("guid");
            if (guid != undefined && guid.length > 0) {
                var item = null;
                listIPDetails.map(function (item1, idx) {
                    if (item1.Guid == guid) {
                        item = item1;
                    }
                });
                if (item != null) {
                    $.postStringify(urlGetContent, item, true, function (response) {
                        if (response.Success) {
                            $("#subModal").openSubModal(response.Data);
                            if (!response.CanEdit) {
                                $('#subModal input').prop('disabled', 'true');
                                $('#subModal select').prop('disabled', 'true');
                            }
                        } else {
                            $.notifyError(response);
                        }
                    });
                }
            }
        });

        $(".btn-update-subitem").on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var urlGetContent = $(this).attr('url-content');
            var table = $(this).parent().parent().find('table.bulk_action');
            /*console.log($(table).find("tr.selected").length);*/
            if ($(table).find("tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($(table).find("tr.selected").length == 1) {
                var guid = $(table).find("tr.selected").attr("guid");
                if (guid != undefined && guid.length > 0) {
                    var item = null;
                    listIPDetails.map(function (item1, idx) {
                        if (item1.Guid == guid) {
                            item = item1;
                        }
                    });
                    $.postStringify(urlGetContent, item, true, function (response) {
                        $("#subModal").openSubModal(response.Data);
                    });
                }
            } else {
                $.notifyError(response);
            }
        });

        $(".btn-remove-subitem").on('click', function () {
            if ($(this).hasClass('disabled')) {
                return;
            }
            if ($("#list-ip-details tr.selected").length <= 0) {
                $.notifyWarning();
            } else if ($("#list-ip-details tr.selected").length === 1) {
                var guid = $("#list-ip-details tr.selected").attr("guid");
                if (guid == undefined || guid.length <= 0) {
                    return;
                }
                var index = -1;
                listIPDetails.map(function (item, idx) {
                    if (item.Guid == guid) {
                        index = idx;
                    }
                });
                if (index > -1) {
                    $.confirm({
                        title: 'Xác nhận xóa',
                        content: "Bạn có muốn xóa dòng này?",
                        buttons: {
                            confirm: {
                                text: "Đồng ý",
                                btnClass: 'btn-blue',
                                action: function () {
                                    listIPDetails.splice(index, 1);
                                    $.notifySuccess({ Message: "Xóa thành công" });
                                    $("#JsonListIPDetails").val(JSON.stringify(listIPDetails));
                                    $("#list-ip-details tr.selected").remove();
                                    if (listIPDetails.length == 0) {
                                        $("#list-ip-details").append('<tr class="no-data"><td colspan="6">Không có dữ liệu</td></tr>');
                                        $("#JsonListIPDetails").val("");
                                        $.loadEventRowClick();
                                        $.loadActiveSubControl();
                                    }
                                }
                            },
                            cancel: {
                                text: "Hủy",
                                action: function () {
                                    //$.alert('Canceled!');
                                }
                            }
                        }
                    });
                }
            } else {
                console.log("error");
            }
        });
    }

    $.initDatepicker = function () {

        $(".datepickervisitor").datetimepicker({
            format: "MM/YYYY",
            locale: 'vi'
        });

        $(".datepicker").datetimepicker({
            //debug: true,
            format: "DD/MM/YYYY",
            locale: 'vi'
        });
        $(".datetimepicker").datetimepicker({
            //debug: true,
            format: "DD/MM/YYYY HH:mm",
            locale: 'vi'
        });
    }

    $.fn.initICheck = function () {
        $(this).find('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });

        $("input[type='text']").on("focus", function () {
            $(this).select();
        });
    }

    $.fn.focusFirstInput = function () {
        this.find("input:not([type=hidden]):first").focus();
    }

    //ReLoad dữ liệu
    $.reloadData = function () {
        var url = $("#frmFilter").attr('action');
        var obj = $("#frmFilter").serializeObject();
        $.postStringify(url, obj, true, function (response) {
            if (response.Success) {
                $("#listContent").html(response.Data);
                $(".x_paging").html(response.Pagination);
                $.loadEventTable();
                $.loadEventPaging();
                $.initSelect2();
                $("#listContent").initICheck();

                //Todo: load event on page
                if (window.loadPageEvent != undefined) {
                    window.loadPageEvent();
                }
                //Todo: reload other region in page
                if (window.reloadPage != undefined) {
                    window.reloadPage(response);
                }

                if ($.loadEventPageNews != undefined) {
                    $.loadEventPageNews();
                }

                //test
                $.loadTotalComment();
                //end test
            }
        });
    }

    $.loadTotalComment = function () {
        if ($("#total-comment").length > 0) {
            var totalcmt = $('table.bulk_action').find('tbody tr:first').attr('item-totalcmt');
            $("#total-comment").text('Quản lý bình luận (' + totalcmt + ')');
        }
    };

    $.loadEventRowClick = function () {
        $('#myModal table.bulk_action').find('tbody tr:first').addClass('selected');
        $('table.bulk_action td').on('click', function () {
            $(this).parent().parent().find('tr').removeClass('selected');
            $(this).parent().toggleClass('selected');
        });

    }

    $.fn.getObjectFromTable = function () {
        this.find('tr:has(td)').map(function (i) {
            var $td = $('td', this);
            return {
                id: ++i,
                name: $td.eq(0).text(),
                age: $td.eq(1).text(),
                grade: $td.eq(2).text()
            }
        }).get();
    }

    $.generateGuid = function guid() {
        return $.s4() + $.s4() + '-' + $.s4() + '-' + $.s4() + '-' +
            $.s4() + '-' + $.s4() + $.s4() + $.s4();
    }

    $.s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    $.initSelect2 = function () {
        $('.select2').select2({
            "language": {
                "noResults": function () {
                    return "Không có dữ liệu";
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        });
    }

    $.initFormUploadImage = function () {
        $(".image-attach").on('change', function (e) {
            var $pveview = $(this).parent().find('.image-preview');
            var files = e.target.files;
            //var myID = 3; //uncomment this to make sure the ajax URL works
            if (files.length > 0) {
                if (window.FormData !== undefined) {
                    var data = new FormData();
                    var file = files[0];
                    if (file.size / 1024 / 1024 > 10) // file <= 2MB
                    {
                        $.alert({
                            title: "File có dung lượng lớn",
                            content: "Dung lượng file " + file.name + " không được vượt quá 10MB",
                            type: 'red',
                            columnClass: "col-md-3 col-md-offset-5",
                            buttons: {
                                confirm: {
                                    text: "Đóng",
                                    btnClass: 'btn-blue'
                                }
                            }
                        });
                        var parent = $(this).parents('.form-upload-img');
                        parent.find('.image-attach').val('');
                    } else {
                        data.append("file", file);
                        var isShowThumb = $("#IsShowThumbnail").val();
                        var isShowMedium = $("#IsShowMediumImg").val();
                        var isShowLarge = $("#IsShowLargeImg").val();
                        $.ajax({
                            type: "POST",
                            url: '/UploadFile/UploadImage?isShowThumb=' + isShowThumb + "&isShowMedium=" + isShowMedium + "&isShowLarge=" + isShowLarge,
                            contentType: false,
                            processData: false,
                            data: data,
                            success: function (response) {
                                if (response.Success) {
                                    $pveview.html(response.Data);
                                    $.initRemoveImage(true);
                                } else {
                                    var parent = $(this).parents('.form-upload-img');
                                    parent.find('.image-attach').val('');
                                    $.notifyError(response);
                                }
                            },
                            error: function (xhr, status, p3, p4) {
                                var err = "Error " + " " + status + " " + p3 + " " + p4;
                                if (xhr.responseText && xhr.responseText[0] == "{")
                                    err = JSON.parse(xhr.responseText).Message;
                                console.log(err);
                            }
                        });
                    }
                } else {
                    alert("This browser doesn't support HTML5 file uploads!");
                }
            }
        });
    }
    $.initRemoveImage = function (isRemoveFileServer) {
        $('.remove').unbind('click');
        $(".remove").on('click', function () {
            var parent = $(this).parents('.form-upload-img');
            var url = parent.find('.image-source').val();
            if (isRemoveFileServer) {
                $.callAjax('/UploadFile/RemoveFile', {
                    url: url
                }, enumMethod.Get, true, function (response) {
                    if (response.Success) {
                        parent.find('.image-attach').val('');
                        parent.find('.image-preview').empty();
                    }
                });
            } else {
                parent.find('.image-attach').val('');
                parent.find('.image-preview').empty();
            }
        });
    }

    $.initFormUploadFile = function () {
        $(".file-attach").on('change', function (e) {
            var $listAttachs = $(this).parent().parent().find('.list-attachments');
            var files = e.target.files;
            //var myID = 3; //uncomment this to make sure the ajax URL works
            if (files.length > 0) {
                if (window.FormData !== undefined) {
                    var data = new FormData();
                    var errorFiles = [];
                    debugger;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        if (file.size / 1024 / 1024 <= 20) // file <= 2MB
                        {
                            data.append("file" + i, file);
                        } else {
                            errorFiles.push(file.name);
                        }
                    }
                    if (errorFiles.length > 0) {
                        $.alert({
                            title: "File có dung lượng lớn",
                            content: "Dung lượng file " + errorFiles.join(',<br/>') + " không được vượt quá 20MB",
                            type: 'red',
                            columnClass: "col-md-3 col-md-offset-5",
                            buttons: {
                                confirm: {
                                    text: "Đóng",
                                    btnClass: 'btn-blue'
                                }
                            }
                        });
                        $(".file-attach").val('');
                    } else {
                        $.ajax({
                            type: "POST",
                            url: '/UploadFile/UploadAttachments',
                            contentType: false,
                            processData: false,
                            data: data,
                            success: function (response) {
                                if (response.Success) {
                                    $listAttachs.append(response.Data);
                                    $.initRemoveAttachment(true);
                                } else {
                                    $.notifyError(response);
                                }
                            },
                            error: function (xhr, status, p3, p4) {
                                var err = "Error " + " " + status + " " + p3 + " " + p4;
                                if (xhr.responseText && xhr.responseText[0] == "{")
                                    err = JSON.parse(xhr.responseText).Message;
                                console.log(err);
                            }
                        });
                    }

                } else {
                    alert("This browser doesn't support HTML5 file uploads!");
                }
            }
        });
    }
    $.initRemoveAttachment = function (isRemoveFileServer) {
        $('.remove-attachment').unbind('click');
        $(".remove-attachment").on('click', function () {
            var parent = $(this).parents('.attachment-item');
            var url = parent.attr('item-url');
            if (isRemoveFileServer) {
                $.callAjax('/UploadFile/RemoveFile', {
                    url: url
                }, enumMethod.Get, true, function (response) {
                    if (response.Success) {
                        parent.remove();
                    }
                });
            } else {
                parent.remove();
            }
        });
    }

    $.getCategories = function (newsType, langCode) {
        $.callAjax("/News/GetCategories", {
            newsType: newsType,
            langcode: langCode
        }, enumMethod.Get, true, function (response) {
            $("#CategoryID").html(response.Data);
        });
    }

    // Init jstree
    $.getAllCategories = function (langCode, newsId, selectedCat) {
        $.callAjax("/News/GetAllCategories", {
            langcode: langCode
        }, enumMethod.Get, true, function (response) {
            $(".tree-category").jstree('destroy');
            $(".tree-category").html(response.Data);
            $.initCatTree(newsId);
            setTimeout(function () {
                $('.tree-category').jstree('check_node', "li[cat-id='" + selectedCat + "']");
            }, 400);
        });
    }

    $.initCatTree = function (newsId) {

        $(".tree-category").jstree({
            "core": {
                "themes": {
                    "icons": false
                }
            },
            "checkbox": {
                "keep_selected_style": false
            },
            "plugins": ["checkbox"]
        });

        setTimeout(function () {
            $(".tree-category").on('changed.jstree', function (e, data) {
                $.getRelatedNews(newsId);
            }).jstree();
        }, 300);

        $(".btn-search-related").on('click', function () {
            $.getRelatedNews(newsId);
        });
    }

    $.getRelatedNews = function (newsId) {
        var lstSelected = $(".tree-category").jstree("get_selected", true);
        var listCategories = [];
        var relatedNews = [];
        lstSelected.map(function (item) {
            if (item.li_attr["cat-id"] != undefined && item.li_attr["cat-id"] != undefined) {
                listCategories.push(item.li_attr["cat-id"]);
            }
        });
        if ($(".item-news-related").length > 0) {
            $(".item-news-related").each(function () {
                if ($(this).is(':checked')) {
                    relatedNews.push($(this).attr('item-id'));
                }
            });
        }
        if (listCategories.length > 0) {
            $.callAjax("/News/GetRelatedNews", {
                listcat: listCategories,
                listSelected: relatedNews,
                newsId: newsId,
                keyword: $("#txtNewsTitle").val()
            }, enumMethod.Post, true, function (response) {
                if (response.Success) {
                    $(".div-related-news").html(response.Data);
                }
            });
        } else {
            $(".div-related-news").html('');
        }
    }

    $.nonUnicode = function (str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
        str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
        str = str.replace(/^\-+|\-+$/g, "");//cắt bỏ ký tự - ở đầu và cuối chuỗi

        return str;
    }

    //HUNGLV sử dụng cho bên react gọi đến
    //call form addOrEditRoleItem
    $.handleShowFormRole = function (id, isView) {
        var url = "/Secure/AddRoleItem";
        if (id != undefined && id !== "") {
            if (isView) {
                url = "/Secure/EditRoleItem?id=" + id + "&isView=" + isView;
            } else {
                url = "/Secure/EditRoleItem?id=" + id;
            } 
        }
        $.appendLoading();
        $.callAjax(url, null, enumMethod.Get, true, function (response) {
            $.removeSpin();
            if (response.Success) {
                $("#myModal").openModal(response.Data);
                $.assignRolePermission();
                $.removeLoading();
            } else {
                $.notifyError(response);
                $.removeLoading();
            }
        });
    };

    //assign role
    $.assignRole = function (id, name, organizationId) {
        var roleId = id;
        var roleName = name;
        if (roleId != null && roleId != undefined) {
            var urlGetContent = "/Secure/ManageRoleAction?roleId=" + roleId + "&roleName=" + roleName + "&organizationId=" + organizationId;
            $.appendSpin();
            $.callAjax(urlGetContent, null, enumMethod.Get, true, function (response) {
                $.removeSpin();
                if (response.Success) {
                    $("#myModal").openModal(response.Data);
                    $.assignPermission(id);
                } else {
                    $.notifyError(response);
                }
            });
        } else {
            $.notifyWarning({
                title: 'Chú ý!',
                text: "Không có vai trò nào được chọn.",
                type: 'warning',
                styling: 'bootstrap3'
            });
        }

    };

    //assign permission
    $.assignPermission = function (id) {

        $(".btn-save-role-action").unbind('click');
        $(".btn-save-role-action").on('click', function () {
            debugger
            var listMenuAction = [];
            var lstActions = $("#list-menus").jstree("get_selected", true);
            lstActions.map(function (item) {
                if (item.li_attr["menu-id"] != undefined && item.li_attr["act-id"] != undefined) {
                    listMenuAction.push({
                        MENU_ID: item.li_attr["menu-id"],
                        ACTION_ID: item.li_attr["act-id"],
                        ORGANIZATION_ID: $("#ORGANIZATION_ID").val()
                    });
                }
            });
            var url = "/Secure/SaveRoleAction";
            var data = {
                ROLE_ID: id,
                ListAction: listMenuAction
            }
            if (listMenuAction.length > 0) {
                $.appendSpin();
                $.postStringify(url, data, true, function (response) {
                    $.removeSpin();
                    if (response.Success) {
                        $.notifySuccess(response);
                        $("#myModal").hideModal();
                    } else {
                        $.notifyError(response);
                    }
                });
            } else {
                $.notifyWarning({
                    title: 'Chú ý!',
                    text: "Không có vai trò nào được chọn.",
                    type: 'warning',
                    styling: 'bootstrap3'
                });
            }
        });
    };

    $.assignRolePermission = function () {
        $(".btn-submit-role-action").unbind('click');
        $(".btn-submit-role-action").on('click', function () {
            var role_name = $("#ROLE_NAME").val();
            //role_code = $("#ROLE_CODE").val(),

            var _validate = true;
            //if (role_code.trim().length == 0) {
            //    $('.error_ROLE_CODE').html('Dữ liệu không được để trống');
            //    _validate = false;
            //} else {
            //    $('.error_ROLE_CODE').html('');
            //    _validate = true;
            //}
            if (role_name.trim().length == 0) {
                $('.error_ROLE_NAME').html('Dữ liệu không được để trống');
                _validate = false;
            } else {
                $('.error_ROLE_NAME').html('');
                _validate = true;
            }

            if (_validate == true) {
                var listMenuAction = [];
                var lstAdministratorAction = $(".administrator").jstree("get_selected", true);
                lstAdministratorAction.map(function (item) {
                    //if (item.li_attr["menu-id"] != undefined && item.li_attr["act-id"] != undefined) {
                    if (item.li_attr["menu-id"] != undefined) {
                        listMenuAction.push({
                            MENU_ID: item.li_attr["menu-id"],
                            ACTION_ID: item.li_attr["act-id"],
                            ACTION_NAME: item.text
                        });
                    }
                });
                $(".administrator").find(".jstree-undetermined").each(
                    function (i, element) {
                        var menuid = $(element).closest('.jstree-node').attr("menu-id");
                        listMenuAction.push({
                            MENU_ID: menuid,
                            ACTION_ID: "",
                            ACTION_NAME: ""
                        });
                    }
                );
                var lstAdministratorOrganizationAction = $(".administrator-organization").jstree("get_selected", true);
                lstAdministratorOrganizationAction.map(function (item) {
                    //if (item.li_attr["menu-id"] != undefined && item.li_attr["act-id"] != undefined) {
                    if (item.li_attr["menu-id"] != undefined) {
                        listMenuAction.push({
                            MENU_ID: item.li_attr["menu-id"],
                            ACTION_ID: item.li_attr["act-id"],
                            ACTION_NAME: item.text
                        });
                    }
                });

                $(".administrator-organization").find(".jstree-undetermined").each(
                    function (i, element) {
                        var menuid = $(element).closest('.jstree-node').attr("menu-id");
                        listMenuAction.push({
                            MENU_ID: menuid,
                            ACTION_ID: "",
                            ACTION_NAME: ""
                        });
                    }
                );
                var lstBusinessLogicAction = $(".business-logic").jstree("get_selected", true);
                lstBusinessLogicAction.map(function (item) {
                    if (item.li_attr["menu-id"] != undefined && item.li_attr["act-id"] != undefined) {
                        listMenuAction.push({
                            MENU_ID: item.li_attr["menu-id"],
                            ACTION_ID: item.li_attr["act-id"],
                            ACTION_NAME: item.text
                        });
                    }
                });
                $(".business-logic").find(".jstree-undetermined").each(
                    function (i, element) {
                        var menuid = $(element).closest('.jstree-node').attr("menu-id");
                        listMenuAction.push({
                            MENU_ID: menuid,
                            ACTION_ID: "",
                            ACTION_NAME: item.text
                        });
                    }
                );
                var url = "/Secure/SaveRoleActionAllApp";
                var action = {
                    ROLE_ID: $("#RoleID").val(),
                    ROLE_NAME: $("#ROLE_NAME").val(),
                    //ROLE_CODE: $("#ROLE_CODE").val(),
                    IS_ACTIVE: $("#IS_ACTIVE").is(":checked") ? 1 : 0
                };
                var data = {
                    ROLE_ID: $("#RoleID").val(),
                    JsonRole: JSON.stringify(action),
                    ListAction: listMenuAction
                }
                if (listMenuAction.length > 0) {
                    $.appendSpin();
                    $.postStringify(url, data, true, function (response) {
                        $.removeSpin();
                        if (response.Success) {
                            $.notifySuccess(response);
                            $("#myModal").hideModal();
                        } else {
                            $.notifyError(response);
                        }
                    });
                } else {
                    $.notifyWarning({
                        title: 'Chú ý!',
                        text: "Không có vai trò nào được chọn.",
                        type: 'warning',
                        styling: 'bootstrap3'
                    });
                }
            }

        });
    };

    //add/edit mdrole
    $.addMdRole = function (id) {
        $.appendLoading();
        var url = "/MdRole/AddRoleItem";
        if (id != undefined && id !== "") {
            url = "/MdRole/EditRoleItem?id=" + id;
        }
        $.callAjax(url, null, enumMethod.Get, true, function (response) {
            $.removeLoading();
            if (response.Success) {
                $("#myModal").openModal(response.Data);
                $.submitMdRolePermission();
            } else {
                $.notifyError(response);
            }
        });
    };
    //view
    $.addViewRole = function (id) {
        $.appendLoading();
        var url = "/MdRole/ViewRole?id=" + id;
        $.callAjax(url, null, enumMethod.Get, true, function (response) {
            $.removeLoading();
            if (response.Success) {
                $("#myModal").openModal(response.Data);
                $.submitMdRolePermission();
            } else {
                $.notifyError(response);
            }
        });
    };

    $.submitMdRolePermission = function () {

        $(".submit-role-action").unbind('click');
        $(".submit-role-action").on('click', function () {
            var role_code = $("#ROLE_Code").val(),
                role_name = $("#ROLE_Name").val();

            var _validate = true;
            if (role_code.trim().length == 0) {
                $('.error_ROLE_CODE').html('Dữ liệu không được để trống');
                _validate = false;
            } else {
                $('.error_ROLE_CODE').html('');
                _validate = true;
            }
            if (role_name.trim().length == 0) {
                $('.error_ROLE_NAME').html('Dữ liệu không được để trống');
                _validate = false;
            } else {
                $('.error_ROLE_NAME').html('');
                _validate = true;
            }
            if (_validate == true) {
                var listMenuAction = [];
                var lstBusinessLogicAction = $(".business-logic").jstree("get_selected", true);
                lstBusinessLogicAction.map(function (item) {
                    //if (item.li_attr["menu-id"] != undefined && item.li_attr["act-id"] != undefined) {
                    //    listMenuAction.push({
                    //        MENU_ID: item.li_attr["menu-id"],
                    //        ACTION_ID: item.li_attr["act-id"]
                    //    });
                    //} 
                    if (item.li_attr["menu-id"] != undefined) {
                        listMenuAction.push({
                            MENU_ID: item.li_attr["menu-id"],
                            ACTION_ID: item.li_attr["act-id"]
                        });
                    }
                });
                $(".business-logic").find(".jstree-undetermined").each(
                    function (i, element) {
                        var menuid = $(element).closest('.jstree-node').attr("menu-id");
                        listMenuAction.push({
                            MENU_ID: menuid,
                            ACTION_ID: ""
                        });
                    }
                );
                var url = "/MdRole/SaveRoleAction";
                var action = {
                    ROLE_ID: $("#RoleID").val(),
                    ROLE_Name: $("#ROLE_Name").val(),
                    ROLE_Code: $("#ROLE_Code").val(),
                    DESCRIPTION: $("#DESCRIPTION").val(),
                    IS_ACTIVE: $("#IS_ACTIVE").is(":checked") ? 1 : 0,
                    LOAD_PAGE_DEFAULT: $("#LOAD_PAGE_DEFAULT").val(),
                    FIND_BY_ROLE_TYPE: $("#FIND_BY_ROLE_TYPE").val()
                };
                var data = {
                    ROLE_ID: $("#RoleID").val(),
                    JsonRole: JSON.stringify(action),
                    ListAction: listMenuAction
                }
                if (listMenuAction.length > 0) {
                    $.appendSpin();
                    $.postStringify(url, data, true, function (response) {
                        $.removeSpin();
                        if (response.Success) {
                            $.notifySuccess(response);
                            $("#myModal").hideModal();
                            location.reload(true);
                        } else {
                            $.notifyError(response);
                        }
                    });
                } else {
                    $.notifyWarning({
                        title: 'Chú ý!',
                        text: "Không có vai trò nào được chọn.",
                        type: 'warning',
                        styling: 'bootstrap3'
                    });
                }
            }

        });
    };

    $.appendLoading = function () {
        $("#loading").show();
    }
    $.removeLoading = function () {
        $("#loading").hide();
    }
    //end HUNGLV

    //convert px to vh
    $.convertPxToVh = function (value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            y = w.innerHeight || e.clientHeight || g.clientHeight;

        var result = (100 * value) / y;
        return result;
    }

    //Độ cao grid theo màn hình
    $.initScrollTable = function () {
        var hContent = $(window).height() - ($(".nav_menu").height()) - ($(".box-title").height() + 40) - ($(".box-filter").height() + 10) - $(".toolbarTable").height() - 60;

        $('.table-custom-scroll').attr("style", "display: block;height: " + hContent + "px !important");
    }

    $.initScrollTableNoFilter = function () {
        var hContent = $(window).height() - ($(".nav_menu").height()) - ($(".box-title").height() + 40) - $(".toolbarTable").height() - 60;

        $('.table-custom-scroll-no-filter').attr("style", "display: block;height: " + hContent + "px !important");
    }

    $.confirmModal = function (options) {
        $.confirm({
            title: options.titleConfirm ? options.titleConfirm : 'Xóa các mục đã chọn',
            //icon: 'fa fa-question-circle',
            //type: 'orange2',
            content: options.textConfirm ? options.textConfirm : "Bạn có chắc chắn muốn <b class='black'>xóa mục đã chọn</b> không?",
            buttons: {
                confirm: {
                    text: options.textBtnOk || 'Có',
                    btnClass: 'btn-blue',
                    action: function () {
                        if (options.onOk)
                            options.onOk()
                    }
                },
                cancel: {
                    text: options.textBtnCancel || 'Không',
                    action: function () {
                        if (options.onCancel)
                            options.onCancel();
                    }
                }
            }
        });
    };
}(jQuery));

$(document).ready(function () {
    $.initScrollTable();
    $.initScrollTableNoFilter();
    //$.loadEventTable();
    //$.loadEventPaging();
    //$.initSelect2();
    // Button Tìm kiếm
    $('.btn-search').on('click', function (e) {
        e.preventDefault();
        var $form = $(this).parents('form');
        var url = $form.attr('action');
        var obj = $form.serializeObject();
        obj["PageNumber"] = 1;
        $.postStringify(url, obj, true, function (response) {
            if (response.Success) {
                $("#listContent").html(response.Data);
                $(".x_paging").html(response.Pagination);
                $.loadEventTable();
                //$.loadActiveControl();
                $.loadEventPaging();
                $.initSelect2();
                $("#listContent").initICheck();
                //Todo: load event on page
                if (window.loadPageEvent != undefined) {
                    window.loadPageEvent();
                }

                //Todo: reload other region in page
                if (window.reloadPage != undefined) {
                    window.reloadPage(response);
                }

                if ($.loadEventPageNews != undefined) {
                    $.loadEventPageNews();
                }
                $.loadTotalComment();
            }
        });
    });
});

$(document)
    .on('shown.bs.modal', '.modal.submodal', function () {
        //$(document.body).addClass('modal-open');
        var backdrop = $(".modal-backdrop.in")[1];
        if (backdrop != null) {
            $(backdrop).css('z-index', "1055");
        }
    })
    .on('hidden.bs.modal', '.modal.submodal', function () {
        subValidator = null;
        $(document.body).addClass('modal-open');
        $("#subModal").html('');
    })
    .on('hidden.bs.modal', '.modal.mainmodal', function () {
        listIPDetails = [];
        formStringify = "";
        //$("#myModal").html('');
    });
// On load save form current state

$(window).bind('beforeunload', function (e) {
    var obj = $("#myModal form").serializeObject();
    if (formStringify !== "" && formStringify !== JSON.stringify(obj)) {
        return true;
    }
    else e = null;
    // i.e; if form state change show box not.
});