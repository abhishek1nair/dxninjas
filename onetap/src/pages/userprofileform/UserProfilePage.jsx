import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import '../../AppointmentPage.css';
import { enroll } from '../../utils/imageHandler';
import { createUser } from '../../utils/api';

import '../../UserCreate.css';

const FormItem = Form.Item;
const Option = Select.Option;


class RegistrationForm extends Component {
  constructor() {
    super();
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
    this.checkScreenshot = this.checkScreenshot.bind(this);
    this.createUser = this.createUser.bind(this);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      loading: false
    };
  }

  createUser(values) {
    enroll({
      image: values.image,
      subjectId: values.phone
    })
    .then((response) => {
      return response.data.face_id;
    })
    .then(faceId => {
      return createUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        faceId
      });
    })
    .then((res) => {
      console.log(res);
      this.setState({ loading: false });
      window.location.hash = `/appointment?phone=${values.phone}`;
    })
    .catch((err) => {
      this.setState({ loading: false });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({ loading: true }, this.createUser(values));
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
    if (this.props.screenshot !== nextProps.screenshot) {
      this.props.form.setFieldsValue({
        image: nextProps.screenshot
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 19
        }
      }
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+91'
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
      );

    return (
      <Form onSubmit={this.handleSubmit}>
        <div style={{ display: 'none' }}>
        <FormItem
          {...formItemLayout}
          label="User Image"
        >
          {getFieldDecorator('image', {
            rules: [{
              required: true, message: 'Please take a screenshot'
            }, {
              validator: this.checkScreenshot
            }]
          })(
            <Input />
            )}
        </FormItem>
        </div>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail'
            }, {
              required: true, message: 'Please input your E-mail'
            }]
          })(
            <Input />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Name"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Please input your name'
            }]
          })(
            <Input />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number' }]
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Registering' : 'Register'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

RegistrationForm.propTypes = {
  screenshot: PropTypes.string,
  form: PropTypes.object.isRequired
};

const WrappedRegistrationForm = Form.create()(RegistrationForm);


export default class UserProfilePage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.capture = this.capture.bind(this);
    this.state = {
      screenshot: null
    };
  }
  capture() {
    this.setState({ screenshot: this.iWebcam.getScreenshot() });
  }
  render() {
    return (
      <div className='c-usercreate__wrapper'>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div className='c-usercreate__title'>
              Patient Registration
            </div>
            <div className='clearfix c-usercreate__body--wrapper'>
              <Col span={10}>
                <div className='c-usercreate__title--2'>
                  Patient Photo
                </div>
                <Webcam
                  audio={false}
                  height={320}
                  ref={(f) => { this.iWebcam = f; } }
                  screenshotFormat="image/jpeg"
                  width={435}
                />
                <div style={{ marginTop: '10px' }}>
                  <Button style={{ marginBottom: '20px' }} onClick={this.capture} type="primary">Capture</Button>
                </div>
                {this.state.screenshot ? <img alt='captured' src={this.state.screenshot} /> : null}
              </Col>
              <Col span={2} />
              <Col span={10}>
                <div className='c-usercreate__title--2'>
                  Patient Details
                </div>
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
