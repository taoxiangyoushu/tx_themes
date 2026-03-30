/**
 * 论文查重字符数计算工具
 * 根据不同查重系统使用不同的字数计算规则
 */

var WordCalculator = (function() {
    'use strict';

    /**
     * 计算字符数的规则配置
     */
    var calculationRules = {
        // 默认规则：统计所有字符（包括中英文、数字、标点、空格）
        'default': function(text) {
            if (!text) return 0;
            // 使用 Array.from 正确处理 Unicode 字符（包括 emoji 等）
            return Array.from(text).length;
        },

        // 知网规则：中文按字符数，英文按单词数
        'cnki': function(text) {
            if (!text) return 0;
            var count = 0;

            // 移除空格和换行符
            var cleanText = text.replace(/[\s\n\r]+/g, ' ');

            // 匹配中文字符（包括全角标点）
            var chineseChars = cleanText.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 匹配英文单词（连续的字母和数字）
            var englishWords = cleanText.match(/[a-zA-Z0-9]+/g);
            count += englishWords ? englishWords.length : 0;

            return count;
        },

        // 维普规则：中文字符 + 英文单词
        'weipu': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计英文单词和数字（包括单独的数字，连字符会拆分）
            var words = text.match(/[a-zA-Z0-9]+/g);
            count += words ? words.length : 0;

            return count;
        },
        'cqvip': function(text) {
            return this.weipu(text);
        },
        'cqvipzc': function(text) {
            return this.weipu(text);
        },
        'cqvipmd': function(text) {
            return this.weipu(text);
        },
        'cqvipbj': function(text) {
            return this.weipu(text);
        },
        'cqvipgs': function(text) {
            return this.weipu(text);
        },
        // 维普AIGC检测：中文字符 + 英文字符（不含空格）
        'cqvipaigc': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计英文字符（按字符数，不是单词数）
            var englishChars = text.match(/[a-zA-Z]/g);
            count += englishChars ? englishChars.length : 0;

            return count;
        },

        // 万方规则：中文字符 + 英文单词
        'wanfang': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计英文单词和数字（包括单独的数字，连字符会拆分）
            var words = text.match(/[a-zA-Z0-9]+/g);
            count += words ? words.length : 0;

            return count;
        },
        'wanfangbd': function(text) {
            return this.wanfang(text);
        },
        'wanfangmd': function(text) {
            return this.wanfang(text);
        },
        'wanfangpu': function(text) {
            return this.wanfang(text);
        },
        'wanfanggl': function(text) {
            return this.wanfang(text);
        },
        // 万方AIGC检测：中文字符 + 英文字符（不含空格）
        'wanfangaigc': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计英文字符（按字符数，不是单词数）
            var englishChars = text.match(/[a-zA-Z]/g);
            count += englishChars ? englishChars.length : 0;

            return count;
        },

        // Turnitin规则：中文字符 + 半角空格 + 有效换行符
        'turnitin': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计半角空格（英文单词分隔符）
            var spaces = text.match(/[ ]/g);
            count += spaces ? spaces.length : 0;

            // 统计有效换行符（非空行的换行符）
            var lines = text.split('\n');
            var effectiveNewlines = 0;
            for (var i = 0; i < lines.length - 1; i++) {
                if (lines[i].trim().length > 0) {
                    effectiveNewlines++;
                }
            }
            count += effectiveNewlines;

            return count;
        },
        'turnitinuk': function(text) {
            return this.turnitin(text);
        },
        'turnitinai': function(text) {
            return this.turnitin(text);
        },

        // PaperPass规则：中文字符 + 半角空格 + 有效换行符
        'paperpass': function(text) {
            if (!text) return 0;
            var cleanText = text.replace(/[\s\n\r\t]+/g, '');
            return Array.from(cleanText).length;
        },

        // Grammarly规则：中文字符 + 半角空格 + 有效换行符
        'grammarly': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计半角空格（英文单词分隔符）
            var spaces = text.match(/[ ]/g);
            count += spaces ? spaces.length : 0;

            // 统计有效换行符（非空行的换行符）
            var lines = text.split('\n');
            var effectiveNewlines = 0;
            for (var i = 0; i < lines.length - 1; i++) {
                if (lines[i].trim().length > 0) {
                    effectiveNewlines++;
                }
            }
            count += effectiveNewlines;

            return count;
        },

        // iThenticate规则：中文字符 + 半角空格 + 有效换行符
        'ithenticate': function(text) {
            if (!text) return 0;
            var count = 0;

            // 统计中文字符
            var chineseChars = text.match(/[\u4e00-\u9fa5]/g);
            count += chineseChars ? chineseChars.length : 0;

            // 统计半角空格（英文单词分隔符）
            var spaces = text.match(/[ ]/g);
            count += spaces ? spaces.length : 0;

            // 统计有效换行符（非空行的换行符）
            var lines = text.split('\n');
            var effectiveNewlines = 0;
            for (var i = 0; i < lines.length - 1; i++) {
                if (lines[i].trim().length > 0) {
                    effectiveNewlines++;
                }
            }
            count += effectiveNewlines;

            return count;
        },

        // 大雅规则：统计所有字符，然后减去CRLF换行符的数量（每个CRLF占2个字符，但只算1个）
        'daya': function(text) {
            if (!text) return 0;
            // 统计所有字符数
            var totalChars = Array.from(text).length;
            // 统计CRLF换行符的数量（每个CRLF占2个字符，但只算1个）
            var crlfCount = (text.match(/\r\n/g) || []).length;
            // 总字符数 = 所有字符数 - CRLF换行符数
            return totalChars - crlfCount;
        },
        'dyai': function(text) {
            return this.daya(text);
        },

        // PaperYY规则：中文字符 + 半角空格 + 有效换行符
        'paperyy': function(text) {
            if (!text) return 0;
            var cleanText = text.replace(/[\s\n\r\t]+/g, '');
            return Array.from(cleanText).length;
        },

        // 早检测规则：字符计数
        'zaojiance': function(text) {
            if (!text) return 0;
            var cleanText = text.replace(/[\s\n\r\t]+/g, '');
            return Array.from(cleanText).length;
        },

        // CheckPass规则：字符计数（不含空格）
        'checkpass': function(text) {
          if (!text) return 0;
            // 统计所有字符数
            var totalChars = Array.from(text).length;
            // 统计CRLF换行符的数量（每个CRLF占2个字符，但只算1个）
            var crlfCount = (text.match(/\r\n/g) || []).length;
            // 总字符数 = 所有字符数 - CRLF换行符数
            return totalChars - crlfCount;
        },

        // 大师查重规则：字符计数（不含空格）
        'dashichachong': function(text) {
            if (!text) return 0;
            var cleanText = text.replace(/[\s\n\r\t]+/g, '');
            return Array.from(cleanText).length;
        },

        // 源文鉴规则：字符计数（不含空格）
        'yuanwenjian': function(text) {
            if (!text) return 0;
            var cleanText = text.replace(/[\s\n\r\t]+/g, '');
            return Array.from(cleanText).length;
        },
        'ywjbd': function(text) {
            return this.yuanwenjian(text);
        },
        'ywjmd': function(text) {
            return this.yuanwenjian(text);
        }
    };

    /**
     * 根据查重系统计算字符数
     * @param {string} text - 要计算的文本
     * @param {string} systemName - 查重系统名称（short_name）
     * @returns {number} 字符数
     */
    function calculate(text, systemName) {
        if (!text) return 0;

        // 转换为小写以匹配规则
        var system = (systemName || 'default').toLowerCase();

        // 查找对应的计算规则
        var rule = calculationRules[system] || calculationRules['default'];

        // 如果规则是函数，直接调用
        if (typeof rule === 'function') {
            return rule.call(calculationRules, text);
        }

        // 默认规则
        return calculationRules['default'](text);
    }

    /**
     * 获取支持的系统列表
     * @returns {Array} 支持的系统名称列表
     */
    function getSupportedSystems() {
        return Object.keys(calculationRules).filter(function(key) {
            return key !== 'default';
        });
    }

    /**
     * 实时计算字符数（用于输入时的实时显示）
     * @param {string} text - 要计算的文本
     * @param {string} systemName - 查重系统名称
     * @param {Function} callback - 回调函数，接收计算结果
     */
    function calculateRealtime(text, systemName, callback) {
        if (typeof callback === 'function') {
            var count = calculate(text, systemName);
            callback(count);
        }
    }

    // 暴露公共方法
    return {
        calculate: calculate,
        calculateRealtime: calculateRealtime,
        getSupportedSystems: getSupportedSystems
    };
})();

// 兼容 CommonJS 和 AMD
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordCalculator;
}
