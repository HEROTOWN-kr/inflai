import React from 'react';
import {
  Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@material-ui/core';

function Privacy() {
  function createData(name, necessary, optional) {
    return {
      name, necessary, optional
    };
  }

  const rows = [
    createData('회원가입', '인스타그램 로그인 아이디, 페이스북 로그인 아이디, 성명, 휴대폰번호, 이메일', '생년월일, 성별, 지역, 배송지주소, 계좌정보'),
    createData('광고주 가입', '회사명, 사업자등록번호, 이메일, 비밀번호, 담당자 성명, 담당자 연락처', '직급(직책), 회사 홈페이지'),
    createData('광고주/판매업체 제품 판매 관련', '계좌정보(은행명, 계좌정보, 예금주), 주소, 업태, 업종', '통신판매업등록번호, 홈페이지, 고객센터등'),
  ];

  const secondTable = {
    titles: [
      {
        text: '제공받는자',
        minWidth: '120px'
      },
      {
        text: '제공목적',
        minWidth: '120px'
      },
      {
        text: '제공정보',
        minWidth: '120px'
      },
      {
        text: '개인정보를 제공받는 자의 개인 정보보유 및 이용기간',
        minWidth: '120px'
      }
    ],
    content: [{
      name: '광고주/판매업체',
      aim: '상품 및 서비스 배송(전송), 구매자확인, CS',
      info: '성명, 이메일, 주소, 휴대폰번호',
      period: '재화 또는 서비스 제공을 완료한 후, 내부 방침 및 기타 관련법령에 의한 정보보호 사유에 따라(제2조. 개인정보의 처리 및 보유 기간) 일정 기간 저장 후 파기'
    }]
  };

  const thirdTable = {
    titles: ['구분', '위탁 업체명', '위탁 업무 내용'],
    content: [
      {
        type: '본인확인',
        name: '주식회사 다날',
        text: '휴대폰 인증',
      },
      {
        type: '알람 발송',
        name: '(주)카카오',
        text: '메시지 발송',
      },
      {
        type: '배송서비스',
        name: '광고주/판매업체가 이용하는 배송사',
        text: '상품 배송',
      },
      {
        type: '전자결제',
        name: '주식회사 다날, 네이버페이',
        text: '신용카드, 휴대폰 등을 통한 결제처리',
      },
      {
        type: '데이터 보관',
        name: 'Amazon Web Services, Inc',
        text: '데이터 보관',
      }
    ]
  };

  return (
    <div>
      <Grid container justify="center" className="privacy">
        <Grid item md={5}>
          <Box py={6}>
            <Box p={8} className="main-box">
              <Grid container spacing={4}>
                <Grid item md={12}>
                  <div className="main-title">개인정보처리방침</div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                   총칙
                  </div>
                  <div className="text-main">
                    ㈜대가들이사는마을(이하 “회사”)는 회원의 개인정보를 안전하게 보호하기 위하여 최선의 노력을 다하고 있으며, 『정보통신 망 이용촉진 및 정보보호 등에 관한 법률』과 『개인정보 보호법』 등 개인정보와 관련된 법령 상의 규정들을 준수하며, 관련 법령에 의거한 개인정보 처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다. 회사는 개인정보 처리 방침을 통하여 회원이 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있고, 개인정보 보호를 위해 어떠한 조 치가 취해지고 있는지에 대하여 알려드립니다. 개인정보 처리방침은 인플라이 홈페이지(https://www.inflai.com/ 이하 ‘홈페이지’)와 인플라이 앱에 공개하여 고객이 언제나 용이하게 열람할 수 있도록 하고 있습니다. 개인정보 처리방침은 정부의 법령이나 지침의 변경, 그리고 보다나은 서비스의 제공을 위하여 그 내용이 수시로 변경될 수 있고 이에 따른 개인정보 처리방침의 지속적인 개선을 위하여 필요한 절차를 정하고 있습니다. 변경 및 개정이 될 경우 회사는 홈페 이지의 개인정보 처리방침을 통해 고지하며, 이메일을 통해서도 빠르게 알려드리고 있습니다. 이용자들께서는 홈페 이지 방문 시 수시로 확인 하시기 바랍니다. 이용자는 개인정보의 수집, 이용, 제공, 위탁 등과 관련한 아래 사항에 대 하여 원하지 않는 경우 동의를 거부할 수 있습니다. 다만, 이용자가 동의를 거부하는 경우 서비스의 전부 또는 일부를 이용할 수 없음을 알려드립니다.
                    <br />
                    ※ 이 개인정보처리방침은 인플라이의 개인정보를 처리하는 모든 사이트(모바일 웹/앱 포함)에 동일하게 적용됩니다.
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                      개인정보의 수집 및 이용 목적
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회사는 홈페이지에서 회원이 가입 시 물품 및 서비스 상품에 대한 원활한 주문과 물품 배송, 대금 결제 및 회원에게 편리하고 유익한 맞춤정보를 제공하기 위해 필요한 최소한의 정보를 필수 사항으로 수집하고 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 회사는 인종 및 민족, 사상 및 신조, 출신지 및 본적지, 정치적 성향 및 범죄기록, 건강상태 등의 회원의 기본적 인권을 현저하게 침해할 우려가 있는 개인정보를 수집하지 않습니다.
                      </Grid>
                      <Grid item md={12}>
                        다. 수집한 개인정보는 다음과 같은 목적으로 사용됩니다.
                      </Grid>
                      <Grid item md={12}>
                        회원가입 관련 : 회원제 서비스 이용에 따른 본인확인, 개인식별절차, 고객문의 및 불만 처리, 각종 고지, 통지사항 전달. 분쟁조정을 위한 기록 보존
                      </Grid>
                      <Grid item md={12}>
                        상품 또는 서비스 제공 관련 : 상품 구매 및 요금 결제, 상품/이벤트 물품 배송 또는 청구지 발송 등 마케팅 및 상품 정보 전달 관련(선택사항: SMS,이메일 수신 동의 시) : 신규 서비스/이벤트 정보 안내, 고객 만족도 조사, 고객 인터뷰 등의 마케팅 이벤트, 마케팅을 위한 통계자료로 활용
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보 수집항목
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회사는 회원가입 및 고객센터를 통한 상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                        {' '}
                      </Grid>
                      <Grid item md={12}>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell />
                                <TableCell>필수 정보</TableCell>
                                <TableCell>선택 정보</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map(row => (
                                <TableRow key={row.name}>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>{row.necessary}</TableCell>
                                  <TableCell>{row.optional}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item md={12}>
                        * 해외 구매대행 상품의 경우는 통관절차를 위해 고객님의 개인통관 고유부호를 별도로 입력 및 제공 동의 받아 상품배송에 활용하게 됩니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 서비스 이용과정에서 아래와 같은 정보들이 자동 생성되어 수집 될 수 있습니다.결제 정보, 서비스 이용기록, 접속 로그, 쿠키, 접속IP정보, 기기정보 등
                        {' '}
                      </Grid>
                      <Grid item md={12}>
                        <Grid container spacing={1}>
                          <Grid item md={12}>
                            다. 유료서비스 이용과정에서 아래와 같은 결제정보들이 수집될 수 있습니다.
                          </Grid>
                          <Grid item md={12}>
                            신용카드 결제시 : 카드사명, 카드번호 등
                          </Grid>
                          <Grid item md={12}>
                            휴대전화 결제시 : 이동전화번호, 통신사, 결제승인번호 등
                          </Grid>
                          <Grid item md={12}>
                            계좌이체시 : 은행명, 계좌번호 등
                          </Grid>
                          <Grid item md={12}>
                            환불 : 환불계좌정보(은행명, 계좌번호, 예금주)
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={12}>
                        라. 회사는 홈페이지의 회원가입 및 고객센터를 통한 상담 등을 통하여 개인정보를 수집합니다.
                      </Grid>
                      <Grid item md={12}>
                        마. 허위 정보 입력 시에 회원은 자신의 정보에 대한 정확성 및 적법성을 보장해야 합니다. 만약 이를 위반하여 타인의 정보를 도용하는 등 각종 방법으로 허위 정보를 입력할 경우에 회사는 회원을 관계법령에 따라 ‘민형사상 조치 등 제반 법적 조치’ 및 강제 탈퇴 시킬 수 있습니다.
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보의 보유 및 이용기간
                  </div>
                  <div className="text-main gray ">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 개인정보를 지체 없이 파기합니다. 단, 내부방침 및 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
                      </Grid>
                      <Grid item md={12}>
                        가. 내부 방침(부정이용기록)
                      </Grid>
                      <Grid item md={12}>
                        <ol className="no-type">
                          <li>
                            <p>보존근거 : 부정이용의 배제 등 회사 방침에 의한 보존</p>
                            <p>보존기간 : 6개월</p>
                          </li>
                        </ol>
                      </Grid>
                      <Grid item md={12}>
                        나. 상법 등 법령에 따라 보존할 필요성이 있는 경우
                      </Grid>
                      <Grid item md={12}>
                        <ol className="no-type">
                          <li>
                            1) 계약 또는 청약철회 등에 관한 기록
                            <p>보존근거 : 전자상거래 등에서의 소비자보호에 관한 법률</p>
                            <p>보존기간 : 5년</p>
                          </li>
                          <li>
                            2) 대금결제 및 재화 등의 공급에 관한 기록
                            <p>보존근거 : 전자상거래 등에서의 소비자보호에 관한 법률</p>
                            <p>보존기간 : 5년</p>
                          </li>
                          <li>
                            3) 소비자의 불만 또는 분쟁처리에 관한 기록
                            <p>보존근거 : 전자상거래 등에서의 소비자보호에 관한 법률</p>
                            <p>보존기간 : 3년</p>
                          </li>
                          <li>
                            4) 본인확인에 관한 기록
                            <p>보존근거 : 정보통신망 이용촉진 및 정보보호 등에 관한 법률</p>
                            <p>보존기간 : 6개월</p>
                          </li>
                          <li>
                            5) 웹사이트 방문기록
                            <p>보존근거 : 통신비밀보호법</p>
                            <p>보존기간 : 3개월</p>
                          </li>
                          <li>
                            6) 전자금융거래에 관한 기록
                            <p>보존근거 : 전자금융거래법</p>
                            <p>보존기간 : 5년</p>
                          </li>
                          <li>
                            7) 부가가치세의 과세표준과 세액의 신고자료
                            <p>보존근거 : 부가가치세법</p>
                            <p>보존기간 : 과세기간에 대한 확정 신고 기한 후 5년</p>
                          </li>
                        </ol>
                      </Grid>
                      <Grid item md={12}>
                        다. 기타 회원의 개별적인 동의가 있는 경우에는 개별 동의에 따른 기간까지 보관합니다.
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보의 파기절차 및 방법
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        회원의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
                      </Grid>
                      <Grid item md={12}>
                        가. 파기절차
                      </Grid>
                      <Grid item md={12}>
                        회원이 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의DB로 옮겨져(종이의 경우 별도의 서류함) 내부방침 및 기타 관련 법령에 의한 정보 보호 사유에 따라(보유 및 이용기간 참조) 일정기간 저장된 후 파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우를 제외하고는 다른 목적으로 이용되지 않습니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 파기방법
                      </Grid>
                      <Grid item md={12}>
                        종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다. 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보의 제3자 제공
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회사는 회원의 개인정보를 개인정보처리방침의 “개인정보의 수집목적 및 이용목적”에서 고지한 범위 또는 서비스 이용약관에 명시한 범위 내에서만 사용하며, 동 범위를 넘어 이용하거나 제3자에게 제공하지 않습니다. 다만 특정 상품의 경우, 판매자에게 이 범위 외의 개인정보가 전달 될 수 있으며, 이 경우 제공목적, 제공정보, 이용기간, 제공항목을 명시한 후 제3자 제공 동의를 구하도록 하겠습니다.
                      </Grid>
                      <Grid item md={12}>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                {secondTable.titles.map(item => (
                                  <TableCell className="head" key={item.text} style={{minWidth: item.minWidth}}>{item.text}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {secondTable.content.map(row => (
                                <TableRow key={row.name}>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>{row.aim}</TableCell>
                                  <TableCell>{row.info}</TableCell>
                                  <TableCell>{row.period}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item md={12}>
                        ※ 구매자와 수취인이 다를 경우에는 수취인의 정보(해외 배송 상품은 개인고유통관부호 포함)가 제공될 수 있습니다
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                      개인정보의 수집 및 이용 목적
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회사는 위탁업무 계약서 등을 통해서 개인정보보호 관련 법규의 준수, 개인정보에 관한 비밀 유지, 제3자 제공에 대한 금지, 사고시의 책임 부담, 위탁기간, 처리 종류 후의 개인정보의 파기 의무 등을 규정하고, 이를 준수하도록 관리하고 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 회사는 보다 나은 서비스의 제공을 위하여, 아래와 같이 개인정보를 위탁하고 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                {thirdTable.titles.map(item => (
                                  <TableCell key={item}>{item}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {thirdTable.content.map(row => (
                                <TableRow key={row.name}>
                                  <TableCell>{row.type}</TableCell>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>{row.text}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    회원 및 그 법정대리인의 권리와 그 행사방법
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회원 및 그 법정대리인은 언제든지 등록되어 있는 본인의 개인정보를 조회하거나 수정할 수 있으며 회원 탈퇴 절차를 통하여 개인정보 이용에 대한 동의 등을 철회할 수 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 개인정보의 조회/수정을 위해서는 홈페이지의 [마이페이지] 내의 [개인정보] 항목에서 확인 가능하며, 가입 해지(동의철회)는 [마이페이지] 내의 "회원탈퇴"를 통하여 탈퇴하실 수 있습니다. 이 외에도 회사의 개인정보 보호책임자에게 서면, 전화 또는 이메일로 연락하여 열람/수정/탈퇴를 요청하실 수 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        다. 회원 및 그 법정대리인이 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 회사는 회원 및 그 법정대리인의 요청에 의해 해지 또는 삭제된 개인정보를 개인정보의 보유 및 이용기간에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    회원의 의무
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회원은 자신의 개인정보를 보호할 의무가 있으며, 회원 본인의 부주의나 인터넷 상의 문제 등으로 개인정보가 유출되어 발생한 문제에 대하여 일체의 책임을 지지 않습니다.
                      </Grid>
                      <Grid item md={12}>
                        나. 회원의 개인정보를 최신의 상태로 정확하게 입력하시기 바랍니다. 회원의 부정확한 정보입력으로 발생하는 문제의 책임은 회원 자신에게 있으며, 타인의 개인정보를 도용하여 회원가입 또는 서비스 이용 시 회원자격 상실과 함께 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』등에 의거하여 처벌될 수 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        다. 회원은 개인정보를 보호받을 권리와 함께 스스로를 보호하고 타인의 정보를 침해하지 않을 의무도 가지고 있습니다. 아이디, 비밀번호를 포함한 회원의 개인정보가 유출되지 않도록 조심하시고 게시물을 포함한 타인의 개인정보를 훼손하지 않도록 유의해 주십시오.
                      </Grid>
                      <Grid item md={12}>
                        라. 회원은 『정보통신망이용촉진 및 정보보호 등에 관한 법률』, 개인정보보호법, 주민등록법 등 기타 개인정보에 관한법률을 준수하여야 합니다.
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    링크사이트
                  </div>
                  <div className="text-main">
                    회사는 회원에게 다른 회사의 웹사이트 또는 자료에 대한 링크를 제공할 수 있습니다. 이 경우 회사는 외부 웹사이트 및 자료에 대한 아무런 통제권이 없으므로 그로부터 제공받는 서비스나 자료의 유용성에 대해 책임질 수 없으며 보증할 수 없습니다. 회사가 포함하고 있는 링크를 통하여 외부 웹사이트의 페이지로 옮겨갈 경우 해당 웹사이트의 개인정보처리방침은 회사와 무관하므로 새로 방문한 웹사이트의 정책을 검토해보시기 바랍니다.
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    게시물
                  </div>
                  <div className="text-main gray">
                    가. 회사는 회원의 게시물을 소중하게 생각하며 변조, 훼손, 삭제되지 않도록 최선을 다하여 보호합니다. 그러나 다음의 경우는 그러하지 아니합니다
                    <p>- 스팸(spam)성 게시물 (예 : 특정사이트에 대한 광고, 타 사이트로의 유도 광고 및 링크 등)</p>
                    <p>- 타인을 비방할 목적으로 허위 사실을 유포하여 타인의 명예를 훼손하는 글</p>
                    <p>- 동의 없는 타인의 신상공개, 회사의 저작권, 제3자의 지적재산권 등 권리를 침해하는 내용, 기타 게시판 주제와 다른내용의 게시물</p>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보 자동수집 장치(쿠키 등)의 설치, 운영 및 그 거부에 관한 사항
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        가. 회사는 회원들에게 보다 적절하고 유용한 서비스를 제공하기 위하여 회원의 정보를 수시로 저장하고 불러오는 ‘쿠키(cookie)’를 사용합니다.
                        <p>쿠키란 회사의 웹사이트를 운영하는데 이용되는 서버가 회원의 컴퓨터로 전송하는 아주 작은 텍스트 파일로서 회원의 컴퓨터 하드디스크에 저장됩니다. 회원은 쿠키의 사용여부에 대하여 선택하실 수 있습니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        나. 쿠키 설정 거부 방법
                        <p>회원은 사용하시는 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다. 단, 쿠키의 저장을 거부할 경우 로그인이 필요한 일부 서비스의 이용에 제한이 생길 수 있음을 양지하시기 바랍니다.</p>
                        <p>쿠키 설치 허용 여부를 지정하는 방법(Internet Explorer의 경우)</p>
                        <p>1) [도구] 메뉴에서[인터넷 옵션]을 선택</p>
                        <p>2) [개인정보]를 클릭</p>
                        <p>3) [고급]을 클릭</p>
                        <p>4) 쿠키 허용여부를 선택</p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보의 기술적/관리적 보호 대책
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        회사는 회원의 개인정보를 보호하기 위하여 다음과 같은 보호 대책을 시행하고 있습니다.
                      </Grid>
                      <Grid item md={12}>
                        가. 비밀번호의 암호화
                        <p>회원의 비밀번호는 암호화되어 저장 및 관리되고 있습니다. 비밀번호는 오직 회원 본인만이 알 수 있으며 개인정보를 확인 및 변경할 경우에도 비밀번호를 알고 있는 본인에 의해서만 가능합니다. 따라서 회원의 비밀번호가 타인에게 알려지지 않도록 각별히 주의하시기 바랍니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        나. 해킹 및 컴퓨터 바이러스 등에 대비
                        <p>회사는 해킹이나 컴퓨터 바이러스에 의하여 회원들의 개인정보가 유출되거나 훼손되는 것을 막기 위하여 필요한 보안조치를 이용하고 있으며, 더욱 향상된 보안조치를 확보할 수 있도록 가능한 모든 기술적 방법을 구비하기 위하여 노력하고 있습니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        다. 개인정보 처리자의 제한 및 교육
                        <p>회사는 개인정보를 처리하는 직원을 최소한으로 제한하고 있으며, 관련 직원들에 대한 교육을 수시로 실시하여 본 방침의 이행 및 준수여부를 확인하고 있습니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        라. 내부관리계획의 수립 및 시행
                        <p>회사는 내부관리계획을 수립 및 시행합니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        마. 접속기록의 보관 및 위변조 방지
                        <p>회사는 개인정보처리시스템에 접속한 기록(웹 로그, 요약정보 등)을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 관리하고 있습니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        바. 해킹 등에 대비한 기술적 대책
                        <p>회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적, 물리적으로 감시 및 차단하고 있습니다.</p>
                      </Grid>
                      <Grid item md={12}>
                        사. 비인가자에 대한 출입 통제
                        <p>회사는 개인정보를 보관하고 있는 개인정보시스템의 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다</p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    개인정보관리책임자/개인정보보호책임자
                  </div>
                  <div className="text-main gray">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        회원의 개인정보를 보호하고 개인정보와 관련된 불만 등을 처리하기 위하여 회사는 고객서비스담당 부서 및 개인정보관리책임자/개인정보보호책임자를 두고 있습니다. 회원의 개인정보와 관련한 문의사항은 아래의 고객서비스담당 부서 또는 개인정보관리책임자/개인정보보호책임자에게 연락하여주시기 바랍니다.
                      </Grid>
                      <Grid item md={12}>
                        고객서비스담당 부서: CS실
                        <p>전화번호: 1522-7947</p>
                        <p>이메일: myfna@naver.com</p>
                      </Grid>
                      <Grid item md={12}>
                        개인정보관리책임자/개인정보보호책임자
                        <p>성명: 이효중</p>
                        <p>전화번호: 1522-7947</p>
                        <p>이메일: myfna@naver.com</p>
                      </Grid>
                      <Grid item md={12}>
                        ※ 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
                        <p>1. 정보보호마크인증위원회www.eprivacy.or.kr/02-550-9531~2)</p>
                        <p>2. 개인정보침해신고센터 (www.118.or.kr / 국번없이 118)</p>
                        <p>3. 대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3571)</p>
                        <p>4. 경찰청 사이버테러대응센터 (www.ctrc.go.kr / 국번없이 182)</p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    아동의 개인정보 보호
                  </div>
                  <div className="text-main">
                    법정대리인의 동의가 필요한 만 14세 미만의 아동의 경우 일부 서비스의 제한될 수 있습니다.
                  </div>
                </Grid>
                <Grid item md={12}>
                  <div className="text-title">
                    고지의 의무
                  </div>
                  <div className="text-main">
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        개인정보 처리방침은 시행일로부터 적용 되며, 법령 및 방침에 따른 변경 및 개정이 될 경우에는 시행 7일 전에 홈페이지를 통해 고지할 것입니다.
                      </Grid>
                      <Grid item md={12}>
                        시행일자 : 2019년 7월 11일
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Privacy;
