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
          name: 'Vikrant Mahajan'
        },
        {
          id: 13,
          name: 'Abhishek Nair'
        },
        {
          id: 14,
          name: 'Aayushi K'
        },
        {
          id: 15,
          name: 'Pranjal Kumar'
        },
        {
          id: 16,
          name: 'Mayank Dharwa'
        },
        {
          id: 18,
          name: 'Debarko De'
        },
        {
          id: 20,
          name: 'Nitesh Garg'
        },
        {
          id: 23,
          name: 'Shashank ND'
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
              <div className='c-remaining-token__wrapper' style={{ background: this.state.colorsArray[index % 2] }}>
                { data.id }&nbsp;&nbsp;{ data.name }
              </div>
            );
          })
        }
      </div>
    );
  }
}
