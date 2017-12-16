import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Tooltip, Icon, Select, Checkbox, Button, DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';

moment.locale('en-gb');

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class RegistrationForm extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
          span: 16,
          offset: 8
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
          label={(
            <span>
              Name&nbsp;
              <Tooltip title="What do you want the doctor to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
          })(
            <Input />
          )}
        </FormItem>
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
          label="Date"
        >
          {getFieldDecorator('date', {
            rules: [{
              required: true,
              message: 'Please choose valid date!'
            }]
          })(
            <DatePicker/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Time"
        >
          {getFieldDecorator('date', {
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
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            rules: [{ required: true, message: 'Please agree to the T&C' }],
            valuePropName: 'checked'
          })(
            <Checkbox>I agree to Practo T&C</Checkbox>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Book Now</Button>
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
