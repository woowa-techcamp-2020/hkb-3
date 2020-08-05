import Api from '../../api/index';
import { paths } from '../../common';

const { default: $ } = require('../../lib/miniJQuery');

class SignupView {
  constructor() {
    this.wrap = $('.wrap').getNode();
  }

  buildNav = () => `
    <nav>
      <a class="nav-icon"></a>
      <a class="nav-link" href="/auth/login">로그인</a>
    </nav>
  `

  addSignupHandler = () => {
    $('.submit-button').click((e) => {
      e.preventDefault(); 
      const name = $('input[name=name]').getNode().value;
      const email = $('input[name=useremail]').getNode().value;
      const password = $('input[name=password]').getNode().value;
      console.log(name, email, password);
      Api.User().createUser({ name, email, password })
        .then(() => {
          $('.nav-link').getNode().click();
        });
    });
  }

  render() {
    this.wrap.innerHTML = `
      <div class="container">
        ${this.buildNav()}
      </div>
      <div class="background-wrap" src="https://images.watcha.net/updatable_images/2650/original/6f4b1a977f1a274fc980e9ff64cd0eca574d96cd.jpg">
        <div class="container">
          <div class="login-wrap">
            <div class="login-title">
              회원가입
            </div>
            <form>
              <div class="signup-name-wrap">
              <input name="name" autocomplete="off" placeholder="이름 (2자 이상)" type="text" value="">
              </div>
              <div class="signup-email-wrap">
                <input 
                  type="text" value="" name="useremail" autocomplete="off" autofocus=""
                  placeholder="이메일 (example@gmail.com)"  class="login-id"
                >
              </div>
              <div class="pw-wrap">
                <input type="password" value="" name="password"  
                  placeholder="비밀번호" autocomplete="off" class="login-pw">
              </div>
              <div class="login-button-wrap">
                <button class="submit-button">회원가입</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    this.addSignupHandler();
  }
}

export default SignupView;