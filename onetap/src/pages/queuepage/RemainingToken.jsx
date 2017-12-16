import React, { Component } from 'react';

export default class RemainingToken extends Component {
  constructor() {
    super();
    this.state = {
      colorsArray: [
        '#ffd2ac',
        '#ffebb3'
      ],
      patientList: [
        {
          id: 12,
          name: 'Vikrant Mahajan',
          phone: '*******990'
        },
        {
          id: 13,
          name: 'Abhishek Nair',
          phone: '*******990'
        },
        {
          id: 14,
          name: 'Aayushi K',
          phone: '*******990'
        },
        {
          id: 15,
          name: 'Pranjal Kumar',
          phone: '*******990'
        },
        {
          id: 16,
          name: 'Mayank Dharwa',
          phone: '*******990'
        },
        {
          id: 18,
          name: 'Debarko De',
          phone: '*******990'
        },
        {
          id: 20,
          name: 'Nitesh Garg',
          phone: '*******990'
        },
        {
          id: 23,
          name: 'Shashank ND',
          phone: '*******990'
        }
      ]
    };
  }
  render() {
    return (
      <div className='clearfix c-remaining-token__full-wrapper'>
        <div className='c-remaining-token__title'>
          Waiting List
        </div>
        {
          this.state.patientList.map((data, index) => {
            return (
              <div key={`c-remaining-token__wrapper-${index}`} className='clearfix c-remaining-token__wrapper' style={{ background: this.state.colorsArray[index % 2] }}>
                <div style={{ display: 'inline-block', float: 'left' }}>
                  { data.id }&nbsp;&nbsp;{ data.name }
                </div>
                <div style={{ display: 'inline-block', float: 'right' }}>
                  { data.phone }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
