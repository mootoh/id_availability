#!/usr/bin/env ruby
require 'cgi'
require 'open-uri'

print "Content-type:text/html\n\n"
cgi = CGI.new
url  = cgi['url']
cond = cgi['cond']

begin
  src = open(url).read
  if cond != ''
    cond = CGI.unescape(cond)

    require 'rubygems'
    require 'hpricot'
    doc = Hpricot(src)
    result = doc.search(cond)
    print result.size == 1 ? 'null' : 'found'
  else
    print 'found'
  end
rescue OpenURI::HTTPError
  print 'null'
end
