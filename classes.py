
import os
import folium
import json
import math as m

from folium.plugins import MarkerCluster

import pandas as pd
from sodapy import Socrata

class Map():

    def __init__(self, location = [51.03834,-114.06740], limit = 2000, client = "data.calgary.ca", map_file = 'template/map'):
        """
        """
        self.location = location
        self.counter = ""
        self.m = folium.Map(location=self.location, zoom_start=11)
        self.clus = MarkerCluster(name="Markers").add_to(self.m)
        self.tooltip = 'Click For More Info'
        self.client = Socrata(client, None)
        self.limit = limit
        self.df = False
        self.map_file = map_file
        self.update_map()

    def fake_double(self):
        """
        Produces fake markers in same location for testing
        """
        s = str(f'<div>Issued Date:</p>\
                                      Work Class Group: </p>\
                                      Contractor Name: </p>\
                                      Original Address</p>\
                                      Community Name: </p></div>')
 
        folium.Marker(self.location,
                                popup = s,
                              tooltip=self.tooltip).add_to(self.clus)

        folium.Marker(self.location,
                                popup = ":-(",
                              tooltip=self.tooltip).add_to(self.clus)
    def update_map(self):
        """
        Updates the map to contain a new set of markers
        """
        self.create_markers()
        self.fake_double()
        self.m.save(self.map_file+str(self.counter)+".html")

    def create_markers(self):
        """
        Expects dataframe input of columns:
        ['issueddate', 'workclassgroup', 'contractorname', 'communityname' , 'originaladdress', 'latitude', 'longitude']
        """
        if self.df is False:
            return
        else:
            print(self.df["longitude"])
            self.df.dropna(subset = ["latitude", "longitude"], inplace=True)
            for i, row in self.df.iterrows():     
                s = str(f'<div>Issued Date: {row.issueddate}</p>\
                                      Work Class Group: {row.workclassgroup}</p>\
                                      Contractor Name: {row.contractorname}</p>\
                                      Original Address: {row.originaladdress}</p>\
                                      Community Name: {row.communityname}</p></div>')
               
                print(i)
            
            folium.Marker([row.latitude, row.longitude], popup = s,tooltip=self.tooltip).add_to(self.clus),
            

    def search(self, start = '2021-11-01', end = '2021-11-04'):
        """
        Sets up self.df
        """
        if self.counter == "":
            self.counter = 0
        self.counter = self.counter + 1
        s = str(f"issueddate > '{start}' and issueddate < '{end}'")
        results = self.client.get("c2es-76ed", where = s, limit=self.limit)
        self.df = pd.DataFrame.from_records(results)
        self.update_map()