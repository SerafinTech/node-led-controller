#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "libMPSSE_spi.h"
#include "ftd2xx.h"

napi_value spiInit(napi_env env, napi_callback_info info);
napi_value spiSendData(napi_env env, napi_callback_info info);

static FT_HANDLE ftHandle;

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    // Arguments 2 and 3 are function name and length respectively
    // We will leave them as empty for this example
    

    status = napi_create_function(env, NULL, 0, spiInit, NULL, &fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to wrap native function");
    }

    status = napi_set_named_property(env, exports, "spiInit", fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to populate exports");
    }

    status = napi_create_function(env, NULL, 0, spiSendData, NULL, &fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to wrap native function");
    }

    status = napi_set_named_property(env, exports, "spiSendData", fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to populate exports");
    }
    
return exports;
}

napi_value spiSendData(napi_env env, napi_callback_info info) {
    FT_STATUS ftstatus = FT_OK;
    napi_status status;
    size_t argc = 1;
    napi_value argv[1];
    void *dataPtr;
    int dataLength = 0;
    int sizeTransferred = 0;

    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    status = napi_get_buffer_info(env, argv[0], &dataPtr, &dataLength);
    ftstatus = SPI_Write(ftHandle, dataPtr, dataLength, &sizeTransferred, SPI_TRANSFER_OPTIONS_SIZE_IN_BYTES);

    napi_value ret;
    status = napi_create_int32(env, sizeTransferred, &ret);

    return ret;

}

napi_value spiInit(napi_env env, napi_callback_info info) {
    //Node Args
    napi_status status;
    size_t argc = 1;
    uint32 clockSetpoint = 100000;
    uint32 spiConfigMode = 0x00000000;
    napi_value argv[1];
    

    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    status = napi_get_value_int32(env, argv[0], &clockSetpoint);
    
    
    FT_STATUS ftstatus = FT_OK;
	FT_DEVICE_LIST_INFO_NODE devList = {0};
	ChannelConfig channelConf = {0};
	uint8 address = 0;
	uint32 channels = 0;
	uint8 latency = 80;

    
    channelConf.ClockRate = clockSetpoint;
	channelConf.LatencyTimer = latency;
    
    channelConf.configOptions = SPI_CONFIG_OPTION_MODE0;
	channelConf.Pin = 0x00FF00FF;

#ifdef _MSC_VER
	Init_libMPSSE();
#endif
    ftstatus = SPI_GetNumChannels(&channels);
    ftstatus = SPI_GetChannelInfo(0,&devList);
    napi_value payload;
    napi_value serialNumber;
    napi_value description;
    napi_value freq;
    status = napi_create_string_utf8(env, devList.SerialNumber, NAPI_AUTO_LENGTH, &serialNumber);
    status = napi_create_string_utf8(env, devList.Description, NAPI_AUTO_LENGTH, &description);
    status = napi_create_int32(env, clockSetpoint, &freq);

    status = napi_create_object(env, &payload);
    status = napi_set_named_property(env, payload, "serialNumber", serialNumber);
    status = napi_set_named_property(env, payload, "description", description);
    status = napi_set_named_property(env, payload, "freq", freq);

    ftstatus = SPI_OpenChannel(0, &ftHandle);
    ftstatus = SPI_InitChannel(ftHandle,&channelConf);
    return payload;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
