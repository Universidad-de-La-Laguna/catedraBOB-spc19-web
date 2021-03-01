import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, message, Card, Typography, Divider, Grid, Collapse } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import {
  CalendarOutlined,
  EuroOutlined,
  IdcardOutlined,
  MailOutlined,
  MobileOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AlertInvalidNumberPeople } from './AlertInvalidNumberPeople';

const createArray = (numElements) => new Array(numElements).fill(0).map((_, i) => i + 1);

const { Panel } = Collapse;
const { useBreakpoint } = Grid;
const NUM_DAYS_LOCKDOWN = 10;
const MAX_NUM_PEOPLE_PER_CONTRACT = 6;
const NUM_PEOPLE_PER_CONTRACT_OPTIONS = createArray(MAX_NUM_PEOPLE_PER_CONTRACT);
const PECUNIARY_LOSS_OPTIONS = [50, 100, 300];

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const [step, setStep] = useState(0);
  const [numPeople, setNumPeople] = useState(-1);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const screens = useBreakpoint();
  const currentBreakpoint =
    Object.entries(screens)
      .filter((screen) => screen[0] !== 'xs')
      .filter((screen) => !!screen[1])
      .map((screen) => screen[0])
      .pop() || 'sm';

  return (
    <PageContainer>
      {step === 2 && (
        <AlertInvalidNumberPeople numPeople={numPeople} numNegativePCR={fileList.length} />
      )}
      <Card>
        <StepsForm
          current={step}
          onCurrentChange={(current) => setStep(current)}
          onFinish={async () => {
            setLoading(true);
            await waitTime(1000);
            message.success(
              formatMessage({
                id: 'pages.newInsurance.successMessage',
                defaultMessage: 'Submitted successfully',
              }),
            );
            setLoading(false);
          }}
          submitter={{
            render: ({ form, onSubmit, step, onPre }) => {
              return [
                step > 0 && (
                  <Button key="pre" onClick={() => onPre?.()}>
                    <FormattedMessage
                      id="pages.newInsurance.prevStepButton"
                      defaultMessage="Previous Step"
                    />
                  </Button>
                ),
                <Button key="next" loading={loading} type="primary" onClick={() => onSubmit?.()}>
                  <FormattedMessage
                    id="pages.newInsurance.nextStepButton"
                    defaultMessage="Next Step"
                  />
                </Button>,
              ];
            },
          }}
          formProps={{
            validateMessages: {
              required: formatMessage({
                id: 'pages.newInsurance.requiredField',
                defaultMessage: 'This field is required',
              }),
            },
          }}
        >
          <StepsForm.StepForm
            name="contract"
            title={formatMessage({
              id: 'pages.newInsurance.contract.title',
              defaultMessage: 'Contract',
            })}
            size="large"
          >
            <Divider>
              <Typography.Title level={2}>
                <FormattedMessage
                  id="pages.newInsurance.contract.title"
                  defaultMessage="Insurance Data"
                />
              </Typography.Title>
            </Divider>

            <ProFormDateTimeRangePicker
              name="contract__times"
              label={formatMessage({
                id: 'pages.newInsurance.contract.times.label',
                defaultMessage: 'Contract Starting and Ending Datetime',
              })}
              width={currentBreakpoint}
              placeholder={[
                formatMessage({
                  id: 'pages.newInsurance.contract.times.startPlaceholder',
                  defaultMessage: 'Starting Time',
                }),
                formatMessage({
                  id: 'pages.newInsurance.contract.times.endPlaceholder',
                  defaultMessage: 'Ending Time',
                }),
              ]}
              tooltip={formatMessage({
                id: 'pages.newInsurance.contract.times.tooltip',
                defaultMessage: 'Please, select the starting and ending date of the contract',
              })}
              fieldProps={{
                format: 'YYYY-MM-DD HH:mm',
                showSecond: false,
                showToday: true,
                minuteStep: 15,
                size: 'large',
              }}
            />

            <ProFormSelect
              name="contract__people"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.contract.numInsurees.label',
                defaultMessage: 'Number of Insured Persons',
              })}
              placeholder={
                <>
                  <UsergroupAddOutlined />
                  &nbsp;
                  <FormattedMessage
                    id="pages.newInsurance.contract.numInsurees.placeholder"
                    defaultMessage="n people"
                  />
                </>
              }
              valueEnum={NUM_PEOPLE_PER_CONTRACT_OPTIONS}
              fieldProps={{
                size: 'large',
                onChange: (value) => setNumPeople(+value + 1),
                value: numPeople > 0 ? numPeople : null,
              }}
            />

            <Divider>
              <Typography.Title level={2}>
                <FormattedMessage
                  id="pages.newInsurance.basicGuarantees.title"
                  defaultMessage="Basic Guarantees"
                />
              </Typography.Title>
            </Divider>

            <ProFormText
              width={currentBreakpoint}
              name="contract__daysLockdown"
              label={formatMessage({
                id: 'pages.newInsurance.basicGuarantees.daysLockdown.label',
                defaultMessage: 'Number of Lockdown days:',
              })}
              initialValue={`${NUM_DAYS_LOCKDOWN} days`}
              readonly
              fieldProps={{
                size: 'large',
                prefix: <CalendarOutlined />,
              }}
            />

            <ProFormSelect
              name="contract__pecuniaryLoss"
              width={currentBreakpoint}
              name="pecuniaryLoss"
              label={formatMessage({
                id: 'pages.newInsurance.basicGuarantees.pecuniaryLoss.label',
                defaultMessage: 'Pecuniary Loss',
              })}
              placeholder={
                <>
                  <EuroOutlined />
                  &nbsp;
                  <FormattedMessage
                    id="pages.newInsurance.basicGuarantees.pecuniaryLoss.placeholder"
                    defaultMessage="Select the quantity"
                  />
                </>
              }
              tooltip={formatMessage({
                id: 'pages.newInsurance.basicGuarantees.pecuniaryLoss.tooltip',
                defaultMessage: 'Quantity to receive per positive and quarantine days',
              })}
              valueEnum={PECUNIARY_LOSS_OPTIONS}
              fieldProps={{
                size: 'large',
              }}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="holder"
            title={formatMessage({
              id: 'pages.newInsurance.holder.title',
              defaultMessage: 'Policy Holder',
            })}
            size="large"
          >
            <ProFormText
              width={currentBreakpoint}
              name="holder__nif"
              label={formatMessage({
                id: 'pages.newInsurance.holder.nif.label',
                defaultMessage: 'NIF',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.nif.placeholder',
                defaultMessage: '12345678Z',
              })}
              // fieldProps={{
              //   size: 'large',
              //   prefix: <IdcardOutlined />,
              // }}
              fieldProps={{
                size: 'large',
              }}
              initialValue="12345678Z"
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__name"
              label={formatMessage({
                id: 'pages.newInsurance.holder.name.label',
                defaultMessage: 'Name',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.name.placeholder',
                defaultMessage: 'Hotel Piña Bob',
              })}
              initialValue="Hotel Piña Bob"
              // fieldProps={{
              //   size: 'large',
              //   prefix: <UserOutlined />,
              // }}
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__address"
              label={formatMessage({
                id: 'pages.newInsurance.holder.address.label',
                defaultMessage: 'Address',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.address.placeholder',
                defaultMessage: 'Avenida Patricio Estrella 314',
              })}
              initialValue="Avenida Patricio Estrella 314"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormDigit
              width={currentBreakpoint}
              name="holder__postal_code"
              label={formatMessage({
                id: 'pages.newInsurance.holder.postalCode.label',
                defaultMessage: 'Postal Code',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.postalCode.placeholder',
                defaultMessage: '11235',
              })}
              initialValue="11235"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__municipality"
              label={formatMessage({
                id: 'pages.newInsurance.holder.municipality.label',
                defaultMessage: 'Municipality',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.municipality.placeholder',
                defaultMessage: 'Santa Cruz de Tenerife',
              })}
              initialValue="Santa Cruz de Tenerife"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__locality"
              label={formatMessage({
                id: 'pages.newInsurance.holder.locality.label',
                defaultMessage: 'Locality',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.locality.placeholder',
                defaultMessage: 'Santa Cruz de Tenerife',
              })}
              initialValue="Santa Cruz de Tenerife"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__phone"
              label={formatMessage({
                id: 'pages.newInsurance.holder.phoneNumber.label',
                defaultMessage: 'Phone Number',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.phoneNumber.placeholder',
                defaultMessage: '123456789',
              })}
              rules={[
                // {
                //   required: true,
                //   message: formatMessage({
                //     id: 'pages.login.phoneNumber.required',
                //     defaultMessage: 'Please enter your cell phone number!',
                //   }),
                // },
                {
                  pattern: /^\d{9}$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.phoneNumber.required',
                    defaultMessage: 'Wrong format of cell phone number!',
                  }),
                },
              ]}
              // fieldProps={{
              //   size: 'large',
              //   prefix: <MobileOutlined />,
              // }}
              initialValue="123456678"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__mobile"
              label={formatMessage({
                id: 'pages.newInsurance.holder.mobileNumber.label',
                defaultMessage: 'Mobile Phone Number',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.mobileNumber.placeholder',
                defaultMessage: '123456789',
              })}
              rules={[
                // {
                //   required: true,
                //   message: formatMessage({
                //     id: 'pages.login.mobileNumber.required',
                //     defaultMessage: 'Please enter your cell mobile number!',
                //   }),
                // },
                {
                  pattern: /^\d{9}$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.mobileNumber.required',
                    defaultMessage: 'Wrong format of cell mobile number!',
                  }),
                },
              ]}
              // fieldProps={{
              //   size: 'large',
              //   prefix: <MobileOutlined />,
              // }}
              initialValue="922123456"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__email"
              label={formatMessage({
                id: 'pages.newInsurance.holder.email.label',
                defaultMessage: 'E-mail',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.email.placeholder',
                defaultMessage: 'bob@hot.el',
              })}
              rules={[
                {
                  required: true,
                  type: 'email',
                },
              ]}
              initialValue="bob@hot.el"
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText
              width={currentBreakpoint}
              name="holder__iban"
              label={formatMessage({
                id: 'pages.newInsurance.holder.iban.label',
                defaultMessage: 'IBAN',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.iban.placeholder',
                defaultMessage: 'ES ',
              })}
              rules={[
                {
                  pattern: /([a-zA-Z]{2})\s*\t*(\d{2})\s*\t*(\d{4})\s*\t*(\d{4})\s*\t*(\d{2})\s*\t*(\d{10})/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.iban.required',
                    defaultMessage: 'Wrong IBAN format!',
                  }),
                },
              ]}
              initialValue="ES 11 2222 3333 44 5555555555"
              fieldProps={{
                size: 'large',
              }}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="people"
            title={formatMessage({
              id: 'pages.newInsurance.people.title',
              defaultMessage: 'People',
            })}
            size="large"
          >
            <div style={{ margin: 'auto' }}>
              <ProFormUploadDragger
                name="people__pcrs"
                width={currentBreakpoint}
                title="Negative PCRs"
                description="Click or drag files to this area to upload"
                showRemoveIcon
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                }}
                action=""
                customRequest={() => {}}
                fieldProps={{
                  listType: 'picture',
                  multiple: 'true',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {numPeople >= 1 && numPeople === fileList.length && (
                <Collapse
                  expandIconPosition="right"
                  style={{ backgroundColor: 'transparent', width: '100%' }}
                  // defaultActiveKey={createArray(numPeople)}
                  defaultActiveKey={[1]}
                >
                  {createArray(numPeople).map((i) => (
                    <Panel
                      header={
                        <Typography.Text>
                          <UserOutlined /> {i}. {fileList[i - 1].name}
                        </Typography.Text>
                      }
                      key={i}
                    >
                      <ProFormText
                        width={currentBreakpoint}
                        name={`people__nif_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.nif.label',
                          defaultMessage: 'NIF',
                        })}
                        placeholder={formatMessage({
                          id: 'pages.newInsurance.people.nif.placeholder',
                          defaultMessage: '12345678Z',
                        })}
                        fieldProps={{
                          size: 'large',
                          prefix: <IdcardOutlined />,
                        }}
                      />
                      <ProFormText
                        width={currentBreakpoint}
                        name={`people__name_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.name.label',
                          defaultMessage: 'Name',
                        })}
                        placeholder={formatMessage({
                          id: 'pages.newInsurance.people.name.placeholder',
                          defaultMessage: 'Chaxiraxi Rodríguez González',
                        })}
                        fieldProps={{
                          size: 'large',
                          prefix: <UserOutlined />,
                        }}
                      />
                      <ProFormText
                        width={currentBreakpoint}
                        name={`people__email_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.email.label',
                          defaultMessage: 'E-mail',
                        })}
                        placeholder={formatMessage({
                          id: 'pages.newInsurance.people.email.placeholder',
                          defaultMessage: 'chaxi@raxi.rg',
                        })}
                        rules={[{ type: 'email' }]}
                        fieldProps={{
                          size: 'large',
                          prefix: <MailOutlined />,
                        }}
                      />
                      <ProFormText
                        width={currentBreakpoint}
                        name={`people__phone_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.phone.label',
                          defaultMessage: 'Phone number',
                        })}
                        placeholder={formatMessage({
                          id: 'pages.newInsurance.people.phone.placeholder',
                          defaultMessage: '123456789',
                        })}
                        // rules={[{ type: 'tel' }]}
                        rules={[
                          {
                            pattern: /^\d{9}$/,
                            message: formatMessage({
                              id: 'pages.newInsurance.people.phone.required',
                              defaultMessage: 'Wrong format of cell phone number!',
                            }),
                          },
                        ]}
                        fieldProps={{
                          size: 'large',
                          prefix: <MobileOutlined />,
                        }}
                      />
                      <ProFormRadio.Group
                        width={currentBreakpoint}
                        name={`people__gender_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.gender.label',
                          defaultMessage: 'I am',
                        })}
                        options={[
                          {
                            label: formatMessage({
                              id: 'pages.newInsurance.people.gender.female',
                              defaultMessage: 'Female',
                            }),
                            value: formatMessage({
                              id: 'pages.newInsurance.people.gender.female',
                              defaultMessage: 'Female',
                            }),
                          },
                          {
                            label: formatMessage({
                              id: 'pages.newInsurance.people.gender.male',
                              defaultMessage: 'Male',
                            }),
                            value: formatMessage({
                              id: 'pages.newInsurance.people.gender.male',
                              defaultMessage: 'Male',
                            }),
                          },
                          {
                            label: formatMessage({
                              id: 'pages.newInsurance.people.gender.nonBinary',
                              defaultMessage: 'Non-binary',
                            }),
                            value: formatMessage({
                              id: 'pages.newInsurance.people.gender.nonBinary',
                              defaultMessage: 'Non-binary',
                            }),
                          },
                        ]}
                        fieldProps={{
                          size: 'large',
                        }}
                      />
                      <ProFormDatePicker
                        width={currentBreakpoint}
                        name={`people__birthday_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.birthday.label',
                          defaultMessage: 'Birthday',
                        })}
                        fieldProps={{
                          format: 'YYYY-MM-DD',
                          size: 'large',
                        }}
                      />
                      <ProFormDateTimePicker
                        width={currentBreakpoint}
                        name={`people__pcr_date_${i}`}
                        label={formatMessage({
                          id: 'pages.newInsurance.people.pcrDate.label',
                          defaultMessage: 'Negative PCR Date',
                        })}
                        fieldProps={{
                          format: 'YYYY-MM-DD HH:mm',
                          showSecond: false,
                          showToday: true,
                          minuteStep: 15,
                          size: 'large',
                        }}
                      />
                    </Panel>
                  ))}
                </Collapse>
              )}
            </div>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};
