import { useLoanApprovalLetter } from '@/hooks/approval-api';
import { formatIndianNumber } from '@/utils/utils';
import { Title } from '@tremor/react';
import { format, parseISO } from 'date-fns';
import Loading from '../../loading';

const SanctionLetter = ({ leadId }: { leadId: string }) => {
  const { loanApprovalLetterData, isFetchingLoanApprovalLetterData } =
    useLoanApprovalLetter({ leadId });

  if (isFetchingLoanApprovalLetterData) {
    return <Loading />;
  }
  return (
    <>
      <Title>Approval Breakdown</Title>
      <div className="webkit" style={{ fontSize: 16, backgroundColor: '#fff' }}>
        <table width="100%" className="wrapper" bgcolor="#fff">
          <tr>
            <td valign="top" width="100%">
              <table
                width="100%"
                role="content-container"
                className="outer"
                align="center">
                <tr>
                  <td width="100%">
                    <table width="100%">
                      <tr>
                        <td>
                          <table
                            width="100%"
                            style={{ width: '100%' }}
                            align="center">
                            <tr>
                              <td
                                role="modules-container"
                                style={{
                                  padding: '0px 0px 0px 0px',
                                  color: '#516775',
                                  textAlign: 'left',
                                }}
                                width="100%"
                                align="left">
                                <table
                                  className="module"
                                  role="module"
                                  data-type="spacer"
                                  width="100%"
                                  style={{ tableLayout: 'fixed' }}
                                  data-muid="iqe7juSSgLbdm3gXWExpsY">
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          padding: '0px 0px 30px 0px',
                                        }}
                                        role="module-content"></td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  className="module"
                                  role="module"
                                  data-type="text"
                                  width="100%"
                                  style={{
                                    backgroundColor: '#ffffff',
                                    tableLayout: 'fixed',
                                  }}
                                  data-muid="8VquPM2ZMj7RJRhAUE6wmF"
                                  data-mc-module-version="2019-10-22">
                                  <tbody>
                                    <tr>
                                      <table
                                        style={{
                                          width: '100%',
                                          borderCollapse: 'collapse',
                                          marginTop: '10px',
                                        }}>
                                        <tbody>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              1
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Loan No.
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {
                                                loanApprovalLetterData?.applicationId
                                              }
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              2
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Approval Date
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {format(
                                                parseISO(
                                                  loanApprovalLetterData?.approvalDate ||
                                                    '',
                                                ),
                                                'dd-MM-yyyy',
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              3
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Loan Amount
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.approvalAmount ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              4
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Rate of interest
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {loanApprovalLetterData?.roi}% per
                                              day
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              5
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Processing Fees @{' '}
                                              {
                                                loanApprovalLetterData?.processingFeesPercent
                                              }
                                              %
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.processingFees ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              6
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              GST 18 % on Processing fee
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.gstAmount ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              7
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Total Deduction (Processing
                                              fee+GST18%)
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.totalDeductions ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              8
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Amount to be Disbursed
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.disbursalAmount ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              9
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Repay Date
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {format(
                                                parseISO(
                                                  loanApprovalLetterData?.repayDate ||
                                                    '',
                                                ),
                                                'dd-MM-yyyy',
                                              )}
                                            </td>
                                          </tr>
                                          <tr
                                            style={{
                                              border: '1px solid #ddd',
                                            }}>
                                            <td
                                              style={{
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              10
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                borderRight: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              Repay Amount
                                            </td>
                                            <td
                                              style={{
                                                borderLeft: '2px solid #ddd',
                                                paddingLeft: '4px',
                                              }}>
                                              {formatIndianNumber(
                                                loanApprovalLetterData?.repayAmount ||
                                                  0,
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default SanctionLetter;
