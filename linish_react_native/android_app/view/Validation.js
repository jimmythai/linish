export default class Validation {
  constructor() {
  }

  static validateForm({email = 'hoeg@example.com', userId = 'hoge', password = 'hogehoge'} = {}) {
    const EMAIL_REGEX = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/;
    const isEmailEmpty = email === '';
    const isUserIdEmpty = userId === '';
    const isPasswordEmpty = password === '';
    const isNotEmailCorrect = !EMAIL_REGEX.test(email);
    const isUserIdLong = userId.length >= 25;
    const isPasswordShortLong = password.length < 8 || password.length >= 100;
    let errors = [];

    if (isEmailEmpty) {
      errors.push("メールアドレスを入力してください");
    } else if (isNotEmailCorrect) {
      errors.push("正しいメールアドレスを入力してください");
    }

    if (isUserIdEmpty) {
      errors.push('ユーザーIDを入力してください');
    } else if (isUserIdLong) {
      errors.push('ユーザーIDは25文字以内で入力してください');
    }

    if (isPasswordEmpty) {
      errors.push('パスワードを入力してください');
    } else if (isPasswordShortLong) {
      errors.push('パスワードは8文字以上100文字以内で入力してください');
    }

    return errors;
  } 
}