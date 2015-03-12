package com.westeros.servlets;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.faces.context.FacesContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import frostillicus.xsp.servlet.AbstractXSPServlet;

public class HouseServlet extends AbstractXSPServlet {
	
	@Override
	protected void doService(HttpServletRequest req, HttpServletResponse res,
					FacesContext facesContext,
					ServletOutputStream out) throws Exception {
		
		// Accommodate two requests, one for all resources, another for a
		// specific resource
		Pattern regExAllPattern = Pattern.compile("/houses");
		Pattern regExIdPattern = Pattern.compile("/houses/([0-9a-zA-Z]{32})");
		
		// res.setContentType("text/plain");
		res.setContentType("application/json");
		// set content type, cache, and Access-Control headers
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "x-requested-with");
		
		// regex parse pathInfo
		Matcher matcher;
		String pathInfo = req.getPathInfo();
		
		// Method invoking the URI
		String reqMethod = req.getMethod();
		
		/*
		 * Specific Document, by UNID. Allowed are GET,
		 * PUT, and DELETE.
		 */
		matcher = regExIdPattern.matcher(pathInfo);
		if (matcher.find()) {
			String unid = matcher.group(1);
			if (reqMethod.equals("GET")) {
				
				// GET the single record
				HouseRecord.doGet(unid, req, res, facesContext, out);
				
			} else if (reqMethod.equals("PUT")) {
				
				// PUT to update, in whole or part, a single record
				HouseRecord.doPut(unid, req, res, facesContext, out);
				
			} else if (reqMethod.equals("DELETE")) {
				
				// DELETE single record
				HouseRecord.doDelete(unid, req, res, facesContext, out);
				
			} else {
				// unsupported request method
				HouseRecord.handleUnexpectedVerb(req, res, facesContext, out);
			}
		}
		
		/*
		 * Collection, allows only GET for the View equivalent or POST for
		 * creating a new Document
		 */
		matcher = regExAllPattern.matcher(pathInfo);
		if (matcher.find()) {
			
			if (reqMethod.equals("GET")) {
				
				HouseCollection.doGet(req, res, facesContext, out);
				
			} else if (reqMethod.equals("POST")) {
				
				HouseCollection.doPost(req, res, facesContext, out);
				
			} else {
				// unsupported request method
				HouseCollection.handleUnexpectedVerb(req, res, facesContext, out);
			}
			
		}
		
	}
	
}
