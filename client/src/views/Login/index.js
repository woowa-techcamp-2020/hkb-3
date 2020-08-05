import Api from '../../api/index';

const { default: $ } = require('../../lib/miniJQuery');

class Login {
  constructor() {
    this.wrap = $('.wrap').getNode();
  }

  buildNav = () => `
    <nav>
      <a class="nav-icon"></a>
      <a class="nav-link" href="/auth/signup">회원가입</a>
    </nav>
  `

  addAuthHandler = () => {
    $('.git-auth-button').click(Api.Auth().getGitAuth);
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
              로그인
            </div>
            <form action="/auth/login" method="post">
              <div class="id-wrap">
                <input 
                  type="email" value="" name="useremail" autocomplete="off" autofocus=""
                  placeholder="이메일 (example@gmail.com)"  class="login-id"
                >
              </div>
              <div class="pw-wrap">
                <input type="password" value="" name="password"  
                  placeholder="비밀번호" autocomplete="off" class="login-pw">
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
      </div>
    `;
  }
}

export default Login;