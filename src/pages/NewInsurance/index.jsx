import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
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
import { Button, notification, Card, Typography, Divider, Grid, Collapse } from 'antd';
import { useIntl, connect, FormattedMessage, history } from 'umi';
import {
  CalendarOutlined,
  CreditCardOutlined,
  EuroOutlined,
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  MobileOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AlertInvalidNumberPeople } from './AlertInvalidNumberPeople';
import sha256 from 'crypto-js/sha256';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const createArray = (numElements) => new Array(numElements).fill(0).map((_, i) => i + 1);

const { Panel } = Collapse;
const { useBreakpoint } = Grid;
const NUM_DAYS_LOCKDOWN = 10;
const MAX_NUM_PEOPLE_PER_CONTRACT = 6;
const NUM_PEOPLE_PER_CONTRACT_OPTIONS = createArray(MAX_NUM_PEOPLE_PER_CONTRACT);
const PECUNIARY_LOSS_OPTIONS = [50, 100, 300];

const readBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);

    reader.readAsDataURL(file);
  });

const hashFileProxy = async (fileProxy) => {
  const file = fileProxy.originFileObj;
  const base64 = await readBase64(file);
  const hash = await sha256(base64).toString();
  return hash;
};

const parseFormData = async (data) => {
  const pcrHashesPromises = data.people__pcrs.map(hashFileProxy);
  const pcrHashes = await Promise.all(pcrHashesPromises);
  const customerUuids = createArray(pcrHashes.length).map(() => uuidv4());

  return {
    id: uuidv4(),
    taker: {
      takerId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
      takerNif: data.holder__nif,
      takerFullName: data.holder__name,
      takerContactAddress: data.holder__address,
      takerContactPostalCode: data.holder__postal_code,
      takerContactTown: data.holder__municipality,
      takerContactLocation: data.holder__locality,
      takerContactTelephone: data.holder__phone,
      takerContactMobile: data.holder__mobile,
      takerContactEmail: data.holder__email,
      takerIBAN: data.holder__iban,
    },
    customers: createArray(pcrHashes.length).map((i) => ({
      customerId: customerUuids[i - 1],
      customerNif: data[`people__nif_${i}`],
      customerFullName: data[`people__name_${i}`],
      customerGender: data[`people__gender_${i}`],
      customerBirthDate: moment(data[`people__birthday_${i}`]).toISOString(),
      customerTelephone: data[`people__phone_${i}`],
      customerEmail: data[`people__email_${i}`],
      negativePcrDate: moment(data[`people__pcr_date_${i}`]).toISOString(),
      negativePcrHash: `0x${pcrHashes[i - 1]}`,
    })),
    contractDate: moment().toISOString(),
    startDate: moment(data.contract__times[0]).toISOString(),
    finishDate: moment(data.contract__times[1]).toISOString(),
    assuredPrice: PECUNIARY_LOSS_OPTIONS[data.contract__pecuniaryLoss],
    pcrRequests: createArray(pcrHashes.length).map((i) => ({
      customerId: customerUuids[i - 1],
      id: uuidv4(),
    })),
  };
};

const NewInsurance = ({ token, apiBaseUri }) => {
  console.log({ apiBaseUri, token });
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
          onFinish={async (data) => {
            const formData = await parseFormData(data);

            setLoading(true);

            const response = await fetch(`${apiBaseUri}/insurances`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
            });

            if (response.ok) {
              notification.success({
                message: formatMessage({
                  id: 'pages.newInsurance.successMessage',
                  defaultMessage:
                    'Insurance registered correctly! 🎉 \n\nYou will be redirected to the insurance list in a moment...',
                }),
              });

              setTimeout(() => history.push(`/insurances?id=${formData.id}`), 5000);
            } else {
              notification.error({
                message: formatMessage({
                  id: 'pages.newInsurance.errorMessage',
                  defaultMessage: 'Something went wrong',
                }),
              });
            }

            setLoading(false);
          }}
          submitter={{
            render: ({ onSubmit, onPre }) => {
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
              name="contract__daysLockdown"
              width={currentBreakpoint}
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
              name="holder__nif"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.nif.label',
                defaultMessage: 'NIF',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.nif.placeholder',
                defaultMessage: '12345678Z',
              })}
              rules={[
                {
                  required: true,
                  pattern: /^(\d{8})([A-Z])$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.nif.required',
                    defaultMessage: 'Wrong NIF!',
                  }),
                },
              ]}
              fieldProps={{
                prefix: <IdcardOutlined />,
                size: 'large',
              }}
              initialValue="12345678Z"
            />
            <ProFormText
              name="holder__name"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.name.label',
                defaultMessage: 'Name',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.name.placeholder',
                defaultMessage: 'Hotel Piña Bob',
              })}
              initialValue="Hotel Piña Bob"
              rules={[{ required: true }]}
              fieldProps={{
                prefix: <HomeOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__address"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.address.label',
                defaultMessage: 'Address',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.address.placeholder',
                defaultMessage: 'Avenida Patricio Estrella 314',
              })}
              initialValue="Avenida Patricio Estrella 314"
              rules={[{ required: true }]}
              fieldProps={{
                prefix: <HomeOutlined />,
                size: 'large',
              }}
            />
            <ProFormDigit
              name="holder__postal_code"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.postalCode.label',
                defaultMessage: 'Postal Code',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.postalCode.placeholder',
                defaultMessage: '11235',
              })}
              initialValue="11235"
              rules={[{ required: true }]}
              fieldProps={{
                prefix: <HomeOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__municipality"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.municipality.label',
                defaultMessage: 'Municipality',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.municipality.placeholder',
                defaultMessage: 'Santa Cruz de Tenerife',
              })}
              initialValue="Santa Cruz de Tenerife"
              rules={[{ required: true }]}
              fieldProps={{
                prefix: <HomeOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__locality"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.locality.label',
                defaultMessage: 'Locality',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.locality.placeholder',
                defaultMessage: 'Santa Cruz de Tenerife',
              })}
              initialValue="Santa Cruz de Tenerife"
              rules={[{ required: true }]}
              fieldProps={{
                prefix: <HomeOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__phone"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.phoneNumber.label',
                defaultMessage: 'Phone Number',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.phoneNumber.placeholder',
                defaultMessage: '123456789',
              })}
              rules={[
                {
                  required: true,
                  pattern: /^\d{9}$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.phoneNumber.required',
                    defaultMessage: 'Wrong format of cell phone number!',
                  }),
                },
              ]}
              initialValue="922123456"
              fieldProps={{
                prefix: <PhoneOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__mobile"
              width={currentBreakpoint}
              label={formatMessage({
                id: 'pages.newInsurance.holder.mobileNumber.label',
                defaultMessage: 'Mobile Phone Number',
              })}
              placeholder={formatMessage({
                id: 'pages.newInsurance.holder.mobileNumber.placeholder',
                defaultMessage: '123456789',
              })}
              rules={[
                {
                  required: true,
                  pattern: /^\d{9}$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.mobileNumber.required',
                    defaultMessage: 'Wrong format of cell mobile number!',
                  }),
                },
              ]}
              initialValue="123456678"
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined />,
              }}
            />
            <ProFormText
              name="holder__email"
              width={currentBreakpoint}
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
              initialValue="info@bobhotel.es"
              fieldProps={{
                prefix: <MailOutlined />,
                size: 'large',
              }}
            />
            <ProFormText
              name="holder__iban"
              width={currentBreakpoint}
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
                  required: true,
                  pattern: /^([a-zA-Z]{2})\s*\t*(\d{2})\s*\t*(\d{4})\s*\t*(\d{4})\s*\t*(\d{2})\s*\t*(\d{10})$/,
                  message: formatMessage({
                    id: 'pages.newInsurance.holder.iban.required',
                    defaultMessage: 'Wrong IBAN format!',
                  }),
                },
              ]}
              initialValue="ES7921000813610123456789"
              fieldProps={{
                prefix: <CreditCardOutlined />,
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
            <Divider>
              <FormattedMessage
                id="pages.newInsurance.people.dividerLabel"
                defaultMessage="Negative PCRs"
              />
            </Divider>
            <ProFormUploadDragger
              name="people__pcrs"
              width={currentBreakpoint}
              title="Negative PCRs"
              description="Click or drag files to this area to upload"
              showRemoveIcon
              fileList={fileList}
              onChange={(obj) => {
                setFileList(obj.fileList);
              }}
              action=""
              customRequest={() => {}}
              beforeUpload={() => false}
              fieldProps={{
                listType: 'picture',
                multiple: true,
              }}
            />

            <div style={{ marginBottom: '1rem' }}>
              {numPeople >= 1 && numPeople === fileList.length && (
                <>
                  <Divider>
                    <FormattedMessage
                      id="pages.newInsurance.people.dividerLabel"
                      defaultMessage="People Info"
                    />
                  </Divider>
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
                          name={`people__nif_${i}`}
                          width={currentBreakpoint}
                          label={formatMessage({
                            id: 'pages.newInsurance.people.nif.label',
                            defaultMessage: 'NIF',
                          })}
                          placeholder={formatMessage({
                            id: 'pages.newInsurance.people.nif.placeholder',
                            defaultMessage: '12345678Z',
                          })}
                          rules={[
                            {
                              pattern: /^(\d{8})([A-Z])$/,
                              message: formatMessage({
                                id: 'pages.newInsurance.people.nif.required',
                                defaultMessage: 'Wrong NIF!',
                              }),
                            },
                          ]}
                          fieldProps={{
                            size: 'large',
                            prefix: <IdcardOutlined />,
                          }}
                        />
                        <ProFormText
                          name={`people__name_${i}`}
                          width={currentBreakpoint}
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
                          name={`people__email_${i}`}
                          width={currentBreakpoint}
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
                          name={`people__phone_${i}`}
                          width={currentBreakpoint}
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
                          name={`people__gender_${i}`}
                          width={currentBreakpoint}
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
                              value: 'FEMALE',
                            },
                            {
                              label: formatMessage({
                                id: 'pages.newInsurance.people.gender.male',
                                defaultMessage: 'Male',
                              }),
                              value: 'MALE',
                            },
                            {
                              label: formatMessage({
                                id: 'pages.newInsurance.people.gender.uninformed',
                                defaultMessage: 'Prefer not to say',
                              }),
                              value: 'UNINFORMED',
                            },
                          ]}
                          fieldProps={{
                            size: 'large',
                          }}
                        />
                        <ProFormDatePicker
                          name={`people__birthday_${i}`}
                          width={currentBreakpoint}
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
                          name={`people__pcr_date_${i}`}
                          width={currentBreakpoint}
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
                </>
              )}
            </div>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};

export default connect(({ login }) => ({
  token: login.token,
  apiBaseUri: login.apiBaseUri,
}))(NewInsurance);
