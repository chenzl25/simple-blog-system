var validator = {
	beChecked: {
		account: {
			errorMessage: '用户名6~18位英文字母、数字',
			emptyMessage: '账号为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		},
		password: {
			errorMessage: '密码6~18位英文字母、数字',
			emptyMessage: '密码为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		},
		// again: {
		// 	errorMessage: '两次密码输入不相同',
		// 	pattern: /^[a-zA-Z0-9]{6,18}$/
		// },
		name: {
			errorMessage: '名字长度为2-20个字符',
			emptyMessage: '名字为空',
			pattern: /^.{2,20}$/
		},
		title: {
			errorMessage: 'blog标题长度为2-50个字符',
			emptyMessage: 'blog标题为空',
			pattern: /^.{2,50}$/
		},
		content: {
			errorMessage: 'blog内容长度为2-10000个字符',
			emptyMessage: 'blog内容为空',
			pattern: /^.{2,10000}$/
		},
	},
	_validate: function(input, field) {
		var result = "";
		for (var key of field) {
			if (key in input) {
				if(!this.beChecked[key].pattern.test(input[key]))
					result += this.beChecked[key].errorMessage + '\n';
			} else {
				result += this.beChecked[key].emptyMessage + '\n';
			}
			// if (key == 'again' && input['again'] !== input['password']) {
			// 	result.again = this.beChecked['again'].errorMessage;
			// }
		}
		return result;
	},
	validateRegister: function(input) {
		return this._validate(input, ['account', 'password', 'name']);
	},
	validateLogin: function(input) {
		return this._validate(input, ['account', 'password']);
	},
	validatePost: function(input) {
		return this._validate(input, ['title', 'content']);
	}
};
module.exports = validator;