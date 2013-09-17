#!/usr/bin/python
#-*coding:utf-8*-
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
import json


def lrender(template=None): #receive template para
    def wrapper(func): #wrapper function f
        def execute(request, *args, **kwargs): #execute function f
            f_r = func(request, *args, **kwargs)
            if isinstance(f_r, HttpResponse): #如果返回的是一个HttpResponse对象，那么就直接返回
                return f_r
            elif template: #否则将返回的字典打包成httpResponse对象再返回
                return render_to_response(template, RequestContext(request, f_r))
        return execute
    return wrapper


class JError(Exception):
    pass


def tojson(func):
    def execute(request, *args, **kwargs):
        f_r = func(request, *args, **kwargs)
        if isinstance(f_r, HttpResponse): #如果返回的是一个HttpResponse对象，那么就直接返回
            return f_r
        else: #否则就将其返回的字典打包成json对象
            return HttpResponse(json.dumps(f_r), 'application/json')
    return execute
