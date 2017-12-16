import React, { Component } from 'react';

export default class RemainingToken extends Component {
  constructor() {
    super();
    this.state = {
      colorsArray: [
        '#caabdf',
        '#ffbbff'
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
          name: 'Aayushi Kul'
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
      <div>
        {
          this.state.patientList.map((data, index) => {
            return (
              <div className='c-remaining-token__wrapper' style={{ background: this.state.colorsArray[index % 2] }}>
                { data.name }
              </div>
            );
          })
        }
      </div>
    );
  }
}
