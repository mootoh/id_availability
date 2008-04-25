#!/usr/bin/env ruby
require 'cgi'
require 'uri'
require 'net/http'
Net::HTTP.version_1_2 # magic

print "Content-type:text/html\n\n"
cgi  = CGI.new
url  = URI.parse(cgi['url'])
cond = cgi['cond']

response = Net::HTTP.start(url.host, url.port) do |http|
  res = http.get(url.request_uri, 'User-Agent' => 'IDAvailabilityRetriever/1.0')
  unless res.is_a?(Net::HTTPSuccess)
    print 'null'
    exit
  end

  if cond == ''
    print 'found'
    exit
  end

  cond = CGI.unescape(cond)

  require 'rubygems'
  require 'hpricot'
  doc = Hpricot(res.body)
  result = doc.search(cond)
  print result.size == 1 ? 'null' : 'found'
end
