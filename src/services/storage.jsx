import React, { Component } from 'react';

export function setStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key));
  // return localStorage.getItem(key);
}

export function removeStorage(key) {
  return localStorage.removeItem(key);
}

export function flushStorage() {
  return localStorage.clear();
}

export default class Storage extends Component {
  render() {
    return <></>;
  }
}
