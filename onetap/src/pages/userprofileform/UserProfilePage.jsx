import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Form, Input, Select, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


class RegistrationForm extends Component {
  constructor() {
    super();
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
    this.checkScreenshot = this.checkScreenshot.bind(this);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  checkScreenshot(rule, value, callback) {
    if (value == null) {
      callback('Take your photo using capture button.');
    } else {
      callback();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenshot != nextProps.screenshot) {
      this.props.form.setFieldsValue({
        image: nextProps.screenshot
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+91',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
      );

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="User Image"
        >
          {getFieldDecorator('image', {
            rules: [{
              required: true, message: 'Please take a screenshot',
            }, {
              validator: this.checkScreenshot
            }]
          })(
            <Input />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
        </FormItem>
      </Form>
    );
  }
}

RegistrationForm.propTypes = {
  screenshot: PropTypes.string.isRequired
};

const WrappedRegistrationForm = Form.create()(RegistrationForm);


export default class UserProfilePage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.setRef = this.setRef.bind(this);
    this.capture = this.capture.bind(this);
    this.state = {
      screenshot: null
    };
  }
  setRef(webcam) {
    this.webcam = webcam;
  }
  capture() {
    this.setState({ screenshot: this.webcam.getScreenshot() });
  }
  render() {
    return (
      <div className='c-appointment__wrapper'>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div className='c-appointment__title'>
              Create User
            </div>
            <div>
              <Col span={10}>
                <Webcam
                  audio={false}
                  height={320}
                  ref={this.setRef}
                  screenshotFormat="image/jpeg"
                  width={400}
                />
                <div>
                  <Button style={{ marginBottom: '20px' }} onClick={this.capture} type="primary">Capture</Button>
                </div>
                {this.state.screenshot ? <img alt='captured' src={this.state.screenshot} /> : null}
              </Col>
              <Col span={10}>
                <WrappedRegistrationForm screenshot={this.state.screenshot} />
              </Col>
            </div>
          </Col>
          <Col span={2} />
        </Row>
      </div>
    );
  }
}