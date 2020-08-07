import Api from '../../api/index';

const { default: $ } = require('../../lib/miniJQuery');

class Login {
  constructor() {
    this.wrap = $('.app').getNode();
  }

  buildNav = () => `
    <nav>
      <a class="nav-icon">우아한 가계부</a>
      <button class="nav-button" href="/auth/signup">회원가입</button>
    </nav>
  `

  addAuthHandler = () => {
    $('.git-auth-button').click(Api.Auth().getGitAuth);
  }

  render() {
    this.wrap.innerHTML = `
      <div class="nav-wrap">
        ${this.buildNav()}
      </div>
      <div class="background-wrap" src="https://images.watcha.net/updatable_images/2650/original/6f4b1a977f1a274fc980e9ff64cd0eca574d96cd.jpg">
        <div class="login-wrap">
          <div class="login-title">로그인</div>
          <form class="login-form" action="/auth/login" method="post">
            <div class="id-wrap">
              <input 
                type="email" value="" name="useremail" autocomplete="off" autofocus=""
                placeholder="이메일 (example@gmail.com)"  class="login-id" maxlength="30">
            </div>
            <div class="pw-wrap">
              <input type="password" value="" name="password"  
                placeholder="비밀번호" autocomplete="off" class="login-pw" maxlength="20">
            </div>
            <div class="login-button-wrap">
              <button type="submit">로그인</button>
            </div>
          </form>
          <p>
            다른방법으로 로그인 하기
          </p>
          <ul>
            <li>
              <a href="/auth/github">
              <button type="button" src="https://i.imgur.com/m60RREc.png" class="git-auth-button">
              </button>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

export default Login;