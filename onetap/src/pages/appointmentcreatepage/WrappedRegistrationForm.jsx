import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Tooltip, Icon, Select, Checkbox, Button, DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import { createAppointment } from '../../utils/api';

moment.locale('en-gb');

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class RegistrationForm extends Component {
  constructor() {
    super();
    this.checkConfirm = this.checkConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createAppointmentFromData = this.createAppointmentFromData.bind(this);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      success: false,
      loading: false
    };
  }

  createAppointmentFromData(values) {
    return createAppointment({
      phone: values.phone,
      appointment: `${values.date.format('YYYY-MM-DD')} ${values.time.format('HH:mm')}`,
      problem: values.illness
    })
    .then((res) => {
      console.log('created appointment', res.data);
      this.setState({
        success: true,
        loading: false
      });
    })
    .catch((err) => {
      console.log('error', err);
      this.setState({
        success: false,
        loading: false
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({ loading: true }, () => {
          this.createAppointmentFromData(values);
        });
      }
    });
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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
        xs: { span: 12 },
        sm: { span: 12 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 6
        },
        sm: {
          span: 16,
          offset: 10
        }
      }
    };
    const tcFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 6
        },
        sm: {
          span: 16,
          offset: 9
        }
      }
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+91'
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+91</Option>
      </Select>
    );
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }]
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Date & Time"
        >
          {getFieldDecorator('date', {
            rules: [{
              required: true,
              message: 'Please choose valid date!'
            }]
          })(
            <DatePicker style={{ marginRight: '11px' }}/>
          )}
          {getFieldDecorator('time', {
            rules: [{
              required: true,
              message: 'Please choose time'
            }]
          })(
            <TimePicker format='hh:mm a' use12Hours={true} minuteStep={30}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Problem"
        >
          {getFieldDecorator('illness', {
            rules: [{ required: true, message: 'Please describe your illness' }]
          })(
            <TextArea rows={6} placeholder='Describe your Illness...'/>
          )}
        </FormItem>
        <FormItem {...tcFormItemLayout}>
          {getFieldDecorator('agreement', {
            rules: [{ required: true, message: 'Please agree to the T&C' }],
            valuePropName: 'checked'
          })(
            <Checkbox>I agree to Practo T&C</Checkbox>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Booking' : 'Book Now'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

RegistrationForm.propTypes = {
  form: PropTypes.object.isRequired
};

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
