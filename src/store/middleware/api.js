import { apiCallBegan, apiCallFailed, apiCallSuccess } from "../api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NAVIGATION } from "../../constants/routes";
const api =
  ({ dispatch, getState }) =>
    (next) =>
      async (action) => {
        if (action.type !== apiCallBegan.type) {
          return next(action);
        }
        const { url, method, data, onSuccess, onStart, onError, headers } = action.payload;

        if (onStart) {
          dispatch({ type: onStart });
        }

        next(action);

        try {
          const deviceId = await AsyncStorage.getItem('deviceId')
          const response = await axios.request({
            baseURL: NAVIGATION.prod.url,
            url,
            method,
            data,
          });
          // general success action
          dispatch(apiCallSuccess(response.data));
          //specific
          if (onSuccess) {
            // const decryptdata = decrypt({ encryptedText: response.data.successResult?.Data, appKey: deviceId })
            // dispatch({ type: onSuccess, payload: JSON.parse(decryptdata) });
          }
        } catch (err) {
          //General error action
          dispatch(apiCallFailed(err.response?.data || err.message));

          //specific
          if (onError) {
            dispatch({ type: onError, payload: err.response?.data || err.message });
          }
        }
      };

export default api;
