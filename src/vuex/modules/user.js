// import httpUtil from '../../utils/httpUtil'
// import apiList from '../../utils/apiList'
export default {
  actions: {
    setUser ({ commit }, usr) {
      commit('SETUSER', usr)
    },
    exitUser ({ commit }) {
      commit('EXITUSER')
    },
    autoUser ({ commit }) {
      commit('AUTOUSER')
    }
  },
  state: {
    currentUser: {},
    isLogin: false,
    token: '',
    protocol: [
      {
        content:
          '<div><span class="text-blue text-bold">《型云会员注册协议》</span><span>（以下简称“本协议”）是您与型云电商平台在《型云电商平台交易总则》的基础上向您就本平台服务等相关事宜所发出的告知。请您仔细阅读《型云电商平台交易总则》及本协议。</span><div>'
      },
      {
        title: '1、注册与账户',
        content:
          '<div>1.1为规范本平台交易活动，根据《中华人民共和国民法通则》、《中华人民共和国合同法》等法律、法规、政策及商务主管部门的有关规定，参照中华人民共和国国家标准 《大宗货物电子交易规范》（GB/T18769-2003）及《型云电商平台交易总则》，制定本协议。 <div><br>' +
          '<div>1.2 型云电商平台（域名xingyun361.com）（以下简称"本平台"）为江苏智恒达型云网络科技有限公司运营的、采用B2B形式的、提供钢材产品交易服务的电子商务平台，本平台的各项电子服务的所有权和运作权归江苏智恒达型云网络科技有限公司所有。 </div><br>' +
          '<div>1.3 非平台注册用户可以游客身份登录平台网址，仅能浏览权限允许内的信息，不能使用平台功能；注册用户通过提交营业执照、组织机构代码证、税务登记证等资料以通过平台认证，成为平台会员，方可浏览平台全部信息，使用平台全部功能。 </div><br>' +
          '<div>1.4 平台会员拥有买方资格。买方应为依据中华人民共和国大陆法律成立的企业法人或其他组织，并具备从事钢材贸易的相关资质。 </div><br>' +
          '<div>1.5 用户应当在使用平台服务之前认真阅读本协议全部内容。如用户对协议有任何疑问的，应向本平台咨询。但无论用户事实上是否在使用平台服务之前认真阅读了本协议内容，只要用户使用本平台服务，则本协议即对用户产生约束，届时用户不应以未阅读本协议的内容或者未获得本平台对用户问询的解答等理由，主张本协议无效，或要求撤销本协议。 </div><br>' +
          '<div>1.6 本平台拥有平台网站各项电子服务的所有权和运作权。用户同意所有注册协议条款并完成注册程序，才能成为平台的正式用户。用户应自行诚信向本平台提供注册资料，确保提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且平台保留终止用户使用平台各项服务的权利。 </div><br>' +
          '<div>1.7 用户点击“同意并接受用户注册协议，登录”的，即视为用户确认自己具有享受平台服务、从事钢材交易等相应的权利能力和行为能力，能够独立承担法律责任。如果用户不同意本协议的约定，用户应立即停止注册程序或停止使用平台服务。 </div><br>' +
          '<div>1.8 用户注册成功后，将产生用户名和密码等账户信息，用户可以根据平台规定改变用户的密码。用户应谨慎合理的保存、使用其用户名和密码。用户不得将在平台注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。如果发现任何人不当使用用户的账户或有任何其他可能危及用户的账户安全的情形时，用户应当立即以有效方式通知平台，要求平台暂停相关服务。 </div><br>' +
          '<div>1.9 本平台有权根据需要不时地制订、修改本协议及平台各项规则，制订、修改完成后，用户第一次登陆平台/第一次使用平台服务时，制订、修改的协议和规则将自动弹出并提示用户。如用户不同意相关变更，应当立即停止使用平台服务。用户继续使用平台服务的，即表示用户接受经修订的协议和规则。 </div><br>'
      },
      {
        title: '2、平台使用规范',
        content:
          '<div>2.1.1 在使用本平台服务过程中实施的所有行为均遵守国家法律、法规等规范性文件及本平台各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议及相关规则。您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保本平台免于因此产生任何损失。 </div><br>' +
          '<div>2.1.2 在交易过程中，遵守诚实信用原则，不采取不正当竞争行为，不扰乱网上交易的正常秩序，不从事与网上交易无关的行为。 </div><br>' +
          '<div>2.1.3 不对本平台上的任何数据作商业性利用，包括但不限于在未经本平台事先书面同意的情况下，以复制、传播等任何方式使用本平台网站上展示的资料。 </div><br>' +
          '<div>2.1.4不使用任何装置、软件或例行程序干预或试图干预本平台的正常运作或正在本平台上进行的任何交易、活动。您不得采取任何将导致不合理的庞大数据负载加诸本平台网络设备的行动。 </div><br>' +
          '<div>2.2.您了解并同意： </div><br>' +
          '<div>2.2.1 本平台有权对您是否违反上述承诺做出单方认定，并根据单方认定结果适用规则予以处理或终止向您提供服务，且无须征得您的同意或提前通知予您。 </div><br>' +
          '<div>2.2.2 基于维护本平台交易秩序及交易安全的需要，本平台有权在发生恶意购买等扰乱市场正常交易秩序的情形下，执行关闭相应交易合同等操作。 </div><br>' +
          '<div>2.2.3 经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者本平台根据自身的判断，认为您的行为涉嫌违反本协议和/或规则的条款或涉嫌违反法律法规的规定的，则本平台有权在平台上公示您的该等涉嫌违法或违约行为及本平台已对您采取的措施。 </div><br>' +
          '<div>2.2.4对于您在本平台上实施的行为，包括您未在本平台上实施但已经对本平台及其用户产生影响的行为，本平台有权单方认定您行为的性质及是否构成对本协议和/或规则的违反，并据此作出相应处罚。您应自行保存与您行为有关的全部证据，并应对无法提供充要证据而承担的不利后果。 </div><br>' +
          '<div>2.2.5 对于您涉嫌违反承诺的行为对任意第三方造成损害的，您均应当以自己的名义独立承担所有的法律责任，并应确保本平台免于因此产生损失或增加费用。 </div><br>' +
          '<div>2.2.6 如您涉嫌违反有关法律或者本协议之规定，使本平台遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，您应当赔偿本平台因此造成的损失及（或）发生的费用，包括合理的律师费用。 </div><br>' +
          '<div>2.2.7 本站上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本站不作特别通知。由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于众所周知的互联网技术因素等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解。 <div><br>' +
          '<div>2.2.8 由地震、台风、水灾、火灾、战争等不可抗力（因素）导致的您所有损失，本平台不承担责任。 </div><br>' +
          '<div>2.2.9 由本平台不可预测或无法控制的系统故障、设备故障、通讯故障、黑客攻击、停电等突发事故给您造成的损失，平台不承担责任。因上述事故造成交易通讯中断或交易数据失真，恢复交易时以故障发生前网络交易系统主机最终记录的交易数据为有效数据。 </div><br>'
      },
      {
        title: '3、协议终止',
        content:
          '<div>3.1您同意，本平台权自行全权决定以任何理由中止、终止向您提供部分或全部本平台服务，暂时冻结或永久冻结（注销）您的账户，且无须为此向您承担任何责任。 </div><br>' +
          '<div>3.2出现以下情况时，本平台有权直接以注销账户的方式终止本协议: </div><br>' +
          '<div>3.2.1本平台终止向您提供服务后，您涉嫌再一次直接或间接或以他人名义注册为本平台用户的； </div><br>' +
          '<div>3.2.2您注册信息中的主要内容不真实或不准确或不及时或不完整； </div><br>' +
          '<div>3.2.3本协议变更时，您明示并通知本平台不愿接受新的服务协议的； </div><br>' +
          '<div>3.2.4其它本平台认为应当终止服务的情况。 </div><br>' +
          '<div>3.3您有权向本平台要求注销您的账户，经本平台审核同意的，本平台注销（永久冻结）您的账户，届时，您与本平台基于本协议的合同关系即终止。您的账户被注销（永久冻结）后，本平台没有义务为您保留或向您披露您账户中的任何信息。 </div><br>' +
          '<div>3.4 您同意，您与本平台的合同关系终止后，本平台仍享有下列权利： </div><br>' +
          '<div>3.4.1 继续保存您的注册信息及您使用本平台服务期间的所有交易信息。 </div><br>' +
          '<div>3.4.2 您在使用本平台服务期间存在违法行为或违反本协议和/或规则的行为的，本平台仍可依据本协议向您主张权利。 </div><br>' +
          '<div>3.5本平台中止或终止向您提供服务后，对于您在服务中止或终止之前的交易行为依下列原则处理，您应独力处理并完全承担进行以下处理所产生的任何争议、损失或增加的任何费用，并应确保本平台免于因此产生任何损失或承担任何费用： </div><br>' +
          '<div>3.5.1您在服务中止或终止之前已经上传至本平台的物品尚未交易的，本平台有权在中止或终止服务的同时删除此项物品的相关信息； </div><br>' +
          '<div>3.5.2 您在服务中止或终止之前已经达成买卖合同，但合同尚未实际履行的，本平台有权删除该买卖合同及其交易物品的相关信息。 </div><br>'
      },
      {
        title: '4、其他约定',
        content:
          '<div>4.1 本规则的订立、解释、履行及效力均受中华人民共和国大陆地区法律管辖。如发生本规则条款与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其他有效条款继续有效。 </div><br>' +
          '<div>4.2 如用户就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向江苏智恒达型云网络科技有限公司工商注册地法院提起诉讼。 </div><br>' +
          '<div>4.3 本规则自用户点击“完成注册”即生效，本协议最终由江苏智恒达型云网络科技有限公司解释。 <div><br>'
      }
    ]
  },
  mutations: {
    SETUSER (state, data) {
      try {
        mpvue.setStorageSync('currentUser', data.user)
        // mpvue.setStorageSync('loginTime', usr.server_time)
        if (data.token) {
          mpvue.setStorageSync('token', data.token)
          state.token = data.token
        }
        state.currentUser = data.user

        console.log('6666++++', data.user.userTypeLogo)

        // TODO 待后端接口完善字段，区分当前账号是买家还是卖家
        if (data.user.userTypeLogo === '01') {
          state.currentUser.type = 'buyer'
        } else {
          state.currentUser.type = 'seller'
        }
        // TODO 搜索历史
        // state.currentUser.localSearchs = []
        state.isLogin = true
      } catch (e) {
        console.error('setuser:>>', e)
        state.currentUser = {}
        state.isLogin = false
        state.token = ''
      }
    },
    EXITUSER (state) {
      try {
        mpvue.removeStorageSync('currentUser')
        mpvue.removeStorageSync('token')
        mpvue.setStorageSync('lastExperienceDay', '')
        mpvue.setStorageSync('overdueReminder', '')
        mpvue.setStorageSync('isAuditingReminder', '')
      } catch (e) {
        console.error('exituser:>>', e)
      }
      state.currentUser = {
        type: 'buyer'
      }
      state.isLogin = false
      state.token = ''
    },
    AUTOUSER (state) {
      try {
        const currentUser = mpvue.getStorageSync('currentUser')
        const token = mpvue.getStorageSync('token')
        console.log('AUTOUSER currentUser:>>', currentUser)
        console.log('AUTOUSER currentUser:>> token', token)
        if (token) {
          state.currentUser = currentUser
          if (currentUser.userTypeLogo === '01') {
            state.currentUser.type = 'buyer'
          } else {
            state.currentUser.type = 'seller'
          }
          state.token = token
          state.isLogin = true
          console.error('AUTOUSER success:>>')
        } else {
          console.log('AUTOUSER token不存在++++，用户未登陆')
        }
        // if (value.user_mark) {
        //   const time = mpvue.getStorageSync('loginTime') || -1
        //   if (time > 0) {
        //     const now = new Date().getTime()
        //     if ((now - time) / (1000 * 3600 * 24) > 30) {
        //       state.isLogin = false
        //       state.currentUser = {
        //         expired: true
        //       }
        //     } else {
        //       mpvue.setStorageSync('loginTime', now)
        //       state.currentUser = value
        //       state.isLogin = true
        //     }
        //   } else {
        //     state.currentUser = value
        //     mpvue.setStorageSync('loginTime', state.currentUser.server_time)
        //     state.isLogin = true
        //   }
        // } else {
        //   state.currentUser = {}
        //   state.isLogin = false
        // }
      } catch (e) {
        console.error('AUTOUSER false:>>', e)
        state.currentUser = {}
        state.isLogin = false
        state.token = ''
      }
    }
  }
}
