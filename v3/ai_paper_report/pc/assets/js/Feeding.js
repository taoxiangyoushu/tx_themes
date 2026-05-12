// 点击 Explanation-text 打开弹窗
$(document).on('click', '.Explanation-text', function() {
    $('.caiReport').show();
    $('.mask_body').show();
});

// 点击关闭按钮关闭弹窗
$(document).on('click', '.caiReport .close_pop_caiReport', function() {
    $('.caiReport').hide();
    $('.mask_body').hide();
});

// 点击蒙版关闭弹窗
$(document).on('click', '.mask_body', function() {
    $('.caiReport').hide();
    $(this).hide();
});

// Tab 切换功能
$(document).on('click', '.feed-tab', function() {
    const tabName = $(this).data('tab');
    
    // 切换 tab 激活状态
    $('.feed-tab').removeClass('active');
    $(this).addClass('active');
    
    // 切换内容显示
    $('.feed-tab-pane').removeClass('active');
    if (tabName === 'text') {
        $('#feed-text-pane').addClass('active');
    } else if (tabName === 'file') {
        $('#feed-file-pane').addClass('active');
    }
});

// 实时更新 textarea 字数统计
$(document).on('input', '#illustrate', function() {
    const currentLength = $(this).val().length;
    $('.feed-textarea-count').text(currentLength + '/2000');
});

// 存储已上传的文件列表
var uploadedFiles = [];

// 暴露给全局，方便其他 JS 文件访问
window.getUploadedFiles = function() {
    return uploadedFiles;
};

// 渲染文件列表
function renderFileList() {
    const $list = $('#feed-file-list');
    $list.empty();
    
    if (uploadedFiles.length === 0) {
        return;
    }
    
    uploadedFiles.forEach(function(file, index) {
        const $item = $(`
            <div class="feed-file-item" data-fid="${file.fid}">
                <span class="feed-file-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 1.5H12.75L15 3.75V16.5H3V1.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.75 1.5V3.75H15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 7.5H12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M6 10.5H12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M6 13.5H10.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </span>
                <span class="feed-file-name">${file.filename}</span>
                <span class="feed-file-delete" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </span>
            </div>
        `);
        $list.append($item);
    });
}

// 删除文件
$(document).on('click', '.feed-file-delete', function(e) {
    e.stopPropagation();
    const index = $(this).data('index');
    uploadedFiles.splice(index, 1);
    renderFileList();
    cocoMessage.success('已删除', 1000);
});

// 文件上传处理
$('#feed_outline_select').on('change', function(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        // 验证文件数量和大小
        if (files.length > 10) {
            cocoMessage.error('最多只能上传10个文件', 2000);
            return;
        }
        
        // 验证文件大小（100M）
        const maxSize = 100 * 1024 * 1024; // 100MB
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                cocoMessage.error(`文件 ${files[i].name} 超过100M限制`, 2000);
                return;
            }
        }
        
        // 构建 FormData
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`files[${i}]`, files[i]);
        }
        
        // 显示上传提示
        cocoMessage.info('文件上传中...', 0);
        
        // 清空 input 的 value，允许再次上传相同文件
        $(this).val('');
        
        // 调用上传接口
        $.ajax({
            type: 'POST',
            url: urls + '/api/project/ai_paper_report/pre_handle/files_upload',
            data: formData,
            processData: false, // 不处理数据
            contentType: false, // 不设置内容类型
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                cocoMessage.destroyAll();
                
                if (result.code === 200) {
                    cocoMessage.success('文件上传成功', 2000);
                    // 将返回的文件添加到列表中
                    if (result.data && result.data.files && result.data.files.length > 0) {
                        // 检查是否超过10个文件限制
                        const totalFiles = uploadedFiles.length + result.data.files.length;
                        if (totalFiles > 10) {
                            cocoMessage.warning(`最多只能上传10个文件，已自动保留前10个`, 2000);
                            const canAdd = 10 - uploadedFiles.length;
                            uploadedFiles = uploadedFiles.concat(result.data.files.slice(0, canAdd));
                        } else {
                            uploadedFiles = uploadedFiles.concat(result.data.files);
                        }
                        renderFileList();
                    }
                } else {
                    cocoMessage.error(result.codeMsg || '上传失败', 2000);
                }
            },
            error: function(xhr, status, error) {
                cocoMessage.destroyAll();
                cocoMessage.error('网络错误，请重试', 2000);
            }
        });
    }
});

// 重置按钮点击事件
$(document).on('click', '.feed-btn-reset', function() {
    // 判断当前激活的 tab
    const activeTab = $('.feed-tab.active').data('tab');
    
    if (activeTab === 'text') {
        // 清除 textarea 内容
        $('#illustrate').val('');
        // 取消勾选
        $('.Explanation-check').prop('checked', false);
        // 恢复原始文本
        $('.Explanation-text').html('<input class="Explanation-check" type="checkbox"/>补充参考资料');
        cocoMessage.success('已清空文本内容', 1000);
    } else if (activeTab === 'file') {
        // 清除已上传的文件列表
        uploadedFiles = [];
        renderFileList();
        // 取消勾选
        $('.Explanation-check').prop('checked', false);
        // 恢复原始文本
        $('.Explanation-text').html('<input class="Explanation-check" type="checkbox"/>补充参考资料');
        cocoMessage.success('已清空文件列表', 1000);
    }
});

// 确定按钮点击事件
$(document).on('click', '.feed-btn-confirm', function() {
    // 判断当前激活的 tab
    const activeTab = $('.feed-tab.active').data('tab');
    
    if (activeTab === 'text') {
        // 检查 textarea 是否有值
        const textValue = $('#illustrate').val().trim();
        if (!textValue) {
            cocoMessage.warning('请输入补充文本内容', 2000);
            // 取消勾选
            $('.Explanation-check').prop('checked', false);
            // 恢复原始文本
            $('.Explanation-text').html('<input class="Explanation-check" type="checkbox"/>补充参考资料');
            return;
        }
        
        // 判断字数是否小于200字
        if (textValue.length < 200) {
            cocoMessage.warning('补充说明字数需在200-2000内', 2000);
            return;
        }
        
        // 关闭弹窗
        $('.caiReport').hide();
        $('.mask_body').hide();
        
        // 勾选 checkbox
        $('.Explanation-check').prop('checked', true).attr('data-type', 'text');
        
        // 修改文本内容
        const charCount = textValue.length;
        $('.Explanation-text').html('<input class="Explanation-check" type="checkbox" checked data-type="text"/>已录入' + charCount + '字');
        
        cocoMessage.success('已录入补充文本', 1000);
        
    } else if (activeTab === 'file') {
        // 检查是否有上传的文件
        if (uploadedFiles.length === 0) {
            cocoMessage.warning('请上传文档文件', 2000);
            // 取消勾选
            $('.Explanation-check').prop('checked', false);
            // 恢复原始文本
            $('.Explanation-text').html('<input class="Explanation-check" type="checkbox"/>补充参考资料');
            return;
        }
        
        // 关闭弹窗
        $('.caiReport').hide();
        $('.mask_body').hide();
        
        // 勾选 checkbox
        $('.Explanation-check').prop('checked', true).attr('data-type', 'file');
        
        // 修改文本内容
        const fileCount = uploadedFiles.length;
        $('.Explanation-text').html('<input class="Explanation-check" type="checkbox" checked data-type="file"/>已录入' + fileCount + '个文件');
        
        cocoMessage.success(`已录入${fileCount}个文件`, 1000);
    }
});
