const { default: $ } = require('../../lib/miniJQuery');

class Login {
  constructor() {
    this.wrap = $('.wrap').getNode();
  }

  buildNav = () => `
    <nav>
      <a class="nav-icon"></a>
      <a class="nav-signup">회원가입</a>
    </nav>
  `

  render() {
    this.wrap.innerHTML = `
      <div class="container">
        ${this.buildNav()}
      </div>
      <div class="background-wrap" src="https://images.watcha.net/updatable_images/2518/original/13ae0fb86b94337c9bc92484200776292778d7e9.jpg">
        <div class="container">
          <div class="login-wrap">
            <div class="login-title">
              로그인
            </div>
            <form action="/auth/login" method="post">
              <div class="id-wrap">
                <input 
                  type="text" value="" name="username" autocomplete="off" autofocus=""
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
                <button type="button" src="https://i.imgur.com/m60RREc.png">
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}

export default Login;