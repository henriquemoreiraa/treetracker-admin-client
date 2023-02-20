import { handleResponse, handleError, makeQueryString } from './apiUtils';
import axios from 'axios';
import { session } from '../models/auth';
// import log from 'loglevel';

const FIELD_DATA_API = process.env.REACT_APP_FIELD_DATA_API_ROOT;
const QUERY_API = process.env.REACT_APP_QUERY_API_ROOT;
const TREETRACKER_API = process.env.REACT_APP_TREETRACKER_API_ROOT;

export default {
  // query legacy api
  getGrower(id) {
    try {
      const growerQuery = `${QUERY_API}/v2/growers/${id}`;

      return fetch(growerQuery, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
  // query new microservice
  getGrowers({ skip, rowsPerPage, filter }, abortController) {
    try {
      const where = filter.getWhereObj ? filter.getWhereObj() : {};
      const growerFilter = {
        ...where,
        limit: rowsPerPage,
        offset: skip,
      };

      const query = `${QUERY_API}/v2/growers${
        growerFilter ? `?${makeQueryString(growerFilter)}` : ''
      }`;

      return fetch(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        signal: abortController?.signal,
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getCount(filter) {
    try {
      const filterObj = filter?.getWhereObj ? filter.getWhereObj() : {};
      const query = `${QUERY_API}/v2/growers/count${
        filterObj ? `?${makeQueryString(filterObj)}` : ''
      }`;
      return fetch(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  getGrowerSelfies(growerId) {
    try {
      const growerSelfiesQuery = `${QUERY_API}/v2/growers/${growerId}/selfies`;

      return fetch(growerSelfiesQuery, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      })
        .then(handleResponse)
        .then((items) => items?.selfies?.filter((img) => img !== ''));
    } catch (error) {
      handleError(error);
    }
  },

  uploadGrowerImage({ growerId, file }) {
    try {
      const formData = new FormData();
      formData.append('grower_account_id', growerId);
      formData.append('image', file);

      const query = `${TREETRACKER_API}/grower_accounts/image`;

      const headers = {
        'content-type': 'multipart/form-data',
        Authorization: session.token,
      };

      return axios.post(query, formData, { headers }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },

  // const query = `${TREETRACKER_API}/grower_accounts/image`;
  updateGrower(growerUpdate) {
    try {
      if (growerUpdate.organizationId === 'null') {
        growerUpdate = { ...growerUpdate, organizationId: null };
      }
      const { id } = growerUpdate;
      const growerQuery = `${FIELD_DATA_API}/grower-accounts/${id}`;

      return fetch(growerQuery, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        body: JSON.stringify(growerUpdate),
      }).then(handleResponse);
    } catch (error) {
      handleError(error);
    }
  },
};
