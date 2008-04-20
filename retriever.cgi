#!/usr/bin/env ruby
require 'cgi'
require 'open-uri'

print "Content-type:text/html\n\n"
cgi = CGI.new
url = cgi['url']
begin
  puts open(url).read
rescue OpenURI::HTTPError
  print 'null'
end
